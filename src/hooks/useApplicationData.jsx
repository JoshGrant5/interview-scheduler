import { useState, useEffect } from "react";
const axios = require('axios');

const useApplicationData = () => {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('/api/days')),
      Promise.resolve(axios.get('/api/appointments')),
      Promise.resolve(axios.get('/api/interviewers'))
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, [])

  const bookInterview = (id, interview, show) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    axios.put(`/api/appointments/${id}`, { interview })
    .then(() => {
      setState({...state, appointments});
      show("SHOW");
    })
    .catch(() => show("ERROR_S", true));
  };

  const cancelInterview = (id, empty) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    axios.delete(`/api/appointments/${id}`)
    .then(() => {
      setState({...state, appointments});
      empty("EMPTY");
    })
    .catch(() => empty("ERROR_D", true));
  };

  const setDay = day => setState({ ...state, day });

  return { state, setDay, bookInterview, cancelInterview }
}

export default useApplicationData;