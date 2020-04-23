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

    // Update state when a message has been received from the server
    webSocket.onmessage = function (event) {
      const response = JSON.parse(event.data);
      dispatch({type: response.type, value: {id: response.id, interview: response.interview }})
    }

    const cleanup = () => {
      webSocket.close();
    };
    return cleanup;
  }, []);

  // Updates selected day state
  const setDay = day => dispatch({type: SET_DAY, value: day});

  // On initial page load fetches data from database and updates state
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

  // Makes an axios put request to the database and updates state when the promise resolves
  function bookInterview(id, interview) {
    const appointment = {...state.appointments[id], interview: { ...interview }};
    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        dispatch({type: SET_INTERVIEW, value: {id, interview}});
      });
  }

  // Makes an axios delete request to the database and updates state when the promise resolves
  function cancelInterview(id) {
    const appointment = {...state.appointments[id], interview: null};
    return axios.delete(`/api/appointments/${id}`, appointment)
      .then(() => {
        dispatch({type: SET_INTERVIEW, value: {id, interview: null}});
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}