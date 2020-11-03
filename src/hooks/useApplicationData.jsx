import { useReducer, useEffect } from "react";
import axios from 'axios';

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

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