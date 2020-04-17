import { useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  
  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {...state, day: action.value};
      case SET_APPLICATION_DATA:
        return {...state, days: action.value.days, appointments: action.value.appointments, interviewers: action.value.interviewers};
      case SET_INTERVIEW: {
        // Update appointments
        const appointment = {...state.appointments[action.value.id], interview: action.value.interview};
        const appointments = {...state.appointments,[action.value.id]: appointment};

        // Update number of spots
        const currentDay = state.days.filter(day => day.appointments.includes(action.value.id))[0];
        let delta = 0;
        if (state.appointments[action.value.id].interview === null && action.value.interview !== null) {
          delta = -1;
        } else if (state.appointments[action.value.id].interview !== null && action.value.interview === null) {
          delta = +1;
        }
        const newDay = {...currentDay,spots: currentDay.spots + delta};
        const newDays = state.days.map(day => (day.id === newDay.id ? newDay : day));

        return {...state, appointments, days: newDays};
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
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