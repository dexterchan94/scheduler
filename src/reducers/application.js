export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return {...state, day: action.value};
    case SET_APPLICATION_DATA:
      return {...state, days: action.value.days, appointments: action.value.appointments, interviewers: action.value.interviewers};
    case SET_INTERVIEW: {
      // Create updated appointments object
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