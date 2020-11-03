import { useReducer, useEffect } from "react";
import axios from 'axios';

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }
    case SET_APPLICATION_DATA:
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }

    case SET_INTERVIEW: {
    
      const interview = action.interview ? {...action.interview} : null;

      const checkAppointment = {...state.appointments[action.id].interview};
      let editOrDelete;
      if (Object.keys(checkAppointment).length === 2) {
        editOrDelete = true;
      }

      const appointment = {
        ...state.appointments[action.id],
        interview: interview
      };
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };
      
      const days = [...state.days];
      let dayID;
      let spots;
      for (let day of days) {
        if (day.appointments.includes(action.id)) {
          if (editOrDelete) { 
            // if interview is not null, we are editing. If null, we are deleting
            interview ? [dayID, spots] = [day.id - 1, day.spots] : [dayID, spots] = [day.id - 1, day.spots + 1];
          } else {
            [dayID, spots] = [day.id - 1, day.spots - 1]; // Creating a new appointment (remove spot)
          }
        }
      }
      days[dayID] = {...days[dayID], spots: spots};

      return { ...state, days, appointments }
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}
const useApplicationData = () => {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      const [days, appointments, interviewers] = [all[0].data, all[1].data, all[2].data];
      dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers });
    });
  }, []);

  //! WebSocket - Commented out for testing purposes. LHL did not design Compass tests to work with webSocket running
  // useEffect(() => {
  //   const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
  //   socket.onopen = () => socket.send('ping');

  //   socket.onmessage = event => {
  //     const data = JSON.parse(event.data);
  //     if (data.type === SET_INTERVIEW) {

  //       dispatch({ type: SET_INTERVIEW, id: data.id, interview: data.interview });
  //     }
  //   };
    
  //   return () => socket.close();
  // }, []);

  const bookInterview = (id, interview) => {
    return axios.put(`/api/appointments/${id}`, { interview })
    .then(() => dispatch({ type: SET_INTERVIEW, id, interview }));
  };

  const cancelInterview = (id, interview = null) => {
    return axios.delete(`/api/appointments/${id}`)
    .then(() => dispatch({ type: SET_INTERVIEW, id, interview }));
  };

  return { state, setDay, bookInterview, cancelInterview }
}

export default useApplicationData;