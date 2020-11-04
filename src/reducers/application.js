const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

// Reducer function to be exported to useApplicationData hook to use with the useReducer hook 
export default function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }

    case SET_APPLICATION_DATA:
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }

    case SET_INTERVIEW: {
      const interview = action.interview ? {...action.interview} : null;
      const checkAppointment = {...state.appointments[action.id].interview};
      // if interview is not null, we are editing. If null, we are deleting
      let editOrDelete; 
      if (Object.keys(checkAppointment).length === 2) {
        editOrDelete = true;
      }
      // Update the appointment/appointments with the given data
      const appointment = {
        ...state.appointments[action.id],
        interview: interview
      };
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };
      // Update the number of spots remaining in the day
      const adjustedSpots = () => {
        const days = [...state.days];
        let dayID;
        let spots;
        for (let day of days) {
          if (day.appointments.includes(action.id)) {
            if (editOrDelete) { 
              [dayID, spots] = interview ? [day.id - 1, day.spots] : [day.id - 1, day.spots + 1];
            } else {
              [dayID, spots] = [day.id - 1, day.spots - 1]; 
            }
          }
        }
        days[dayID] = {...days[dayID], spots: spots};
        return days;
      }

      return { ...state, days: adjustedSpots(), appointments }
      
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}
export {SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW};