import { useReducer, useEffect } from "react";
const axios = require('axios');

const useApplicationData = () => {

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
        const appointment = {
          ...state.appointments[action.id],
          interview: { ...action.interview }
        };
        const appointments = {
          ...state.appointments,
          [action.id]: appointment
        };
        return { ...state, days: action.days, appointments }
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

  // const [state, setState] = useState({
  //   day: "Monday",
  //   days: [],
  //   appointments: {},
  //   interviewers: {}
  // });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('/api/days')),
      Promise.resolve(axios.get('/api/appointments')),
      Promise.resolve(axios.get('/api/interviewers'))
    ]).then((all) => {
      // setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
      const [days, appointments, interviewers] = [all[0].data, all[1].data, all[2].data];
      dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers });
    });
  }, [])

  // const adjustSpots = (id, up) => {
  //   const days = [...state.days];
  //   let dayID;
  //   let spots;
  //   for (let day of state.days) {
  //     if (day.appointments.includes(id)) {
  //       up ? [dayID, spots] = [day.id - 1, day.spots + 1] : [dayID, spots] = [day.id - 1, day.spots - 1];
  //     }
  //   }
  //   days[dayID].spots = spots;
  //   return days;
  // };

  const adjustSpots = (id, interview) => {
    const days = [...state.days];
    let dayID;
    let spots;
    for (let day of state.days) {
      if (day.appointments.includes(id)) {
        interview ? [dayID, spots] = [day.id - 1, day.spots - 1] : [dayID, spots] = [day.id - 1, day.spots + 1];
      }
    }
    days[dayID].spots = spots;
    return days;
  };

  const bookInterview = (id, interview, show) => {
    // const appointment = {
    //   ...state.appointments[id],
    //   interview: { ...interview }
    // };
    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };
    axios.put(`/api/appointments/${id}`, { interview })
    .then(() => {
      // setState({...state, days: adjustSpots(id, false), appointments});
      const days = adjustSpots(id, interview)
      dispatch({ type: SET_INTERVIEW, id, interview, days });
      show("SHOW");
    })
    .catch(() => show("ERROR_S", true));
  };

  const cancelInterview = (id, empty) => {
    // const appointment = {
    //   ...state.appointments[id],
    //   interview: null
    // };
    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };
    axios.delete(`/api/appointments/${id}`)
    .then(() => {
      // setState({...state, days: adjustSpots(id, true), appointments});
      const days = adjustSpots(id, null)
      dispatch({ type: SET_INTERVIEW, id, interview: null, days });
      empty("EMPTY");
    })
    .catch(() => empty("ERROR_D", true));
  };

  // const setDay = day => setState({ ...state, day });
  const setDay = day => dispatch({ type: SET_DAY, day });

  return { state, setDay, bookInterview, cancelInterview }
}

export default useApplicationData;