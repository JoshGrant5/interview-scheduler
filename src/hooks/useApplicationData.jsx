import { useReducer, useEffect } from "react";
const axios = require('axios');

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
            interview ? [dayID, spots] = [day.id - 1, day.spots] : [dayID, spots] = [day.id - 1, day.spots + 1]
          } else {
            [dayID, spots] = [day.id - 1, day.spots - 1] // Creating a new appointment (remove spot)
          }
        }
      }
      days[dayID].spots = spots;

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
      Promise.resolve(axios.get('/api/days')),
      Promise.resolve(axios.get('/api/appointments')),
      Promise.resolve(axios.get('/api/interviewers'))
    ]).then((all) => {
      const [days, appointments, interviewers] = [all[0].data, all[1].data, all[2].data];
      dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers });
    });
  }, []);

  // WebSocket
  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    socket.onopen = () => socket.send('ping');

    socket.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.type === SET_INTERVIEW) {

        dispatch({ type: SET_INTERVIEW, id: data.id, interview: data.interview });
      }
    };
    
    return () => socket.close();
  }, []);

  const bookInterview = (id, interview) => {
    return axios.put(`/api/appointments/${id}`, { interview });
  };

  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`);
  };

  

  return { state, setDay, bookInterview, cancelInterview }
}

export default useApplicationData;