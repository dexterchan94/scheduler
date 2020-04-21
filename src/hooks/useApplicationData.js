import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW } from "../reducers/application";

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // Websocket logic
  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onopen = function (event) {
      // const message = "Connection Established!"
      // webSocket.send(JSON.stringify(message)); 
    };

    webSocket.onmessage = function (event) {
      const response = JSON.parse(event.data);
      dispatch({type: response.type, value: {id: response.id, interview: response.interview }})
    }

    const cleanup = () => {
      webSocket.close();
    };
    return cleanup;
  }, []);

  const setDay = day => dispatch({type: SET_DAY, value: day});

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then((all) => {
      dispatch({type: SET_APPLICATION_DATA, value: {days: all[0].data, appointments: all[1].data, interviewers: all[2].data}});
    })
  }, []);

  function bookInterview(id, interview) {
    const appointment = {...state.appointments[id], interview: { ...interview }};
    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        dispatch({type: SET_INTERVIEW, value: {id, interview}});
      });
  }

  function cancelInterview(id) {
    const appointment = {...state.appointments[id], interview: null};
    return axios.delete(`/api/appointments/${id}`, appointment)
      .then(() => {
        dispatch({type: SET_INTERVIEW, value: {id, interview: null}});
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}