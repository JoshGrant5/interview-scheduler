const fixtures = {
  days: [
    {
      id: 1,
      name: "Monday",
      appointments: [1, 2],
      interviewers: [1, 2],
      spots: 1
    },
    {
      id: 2,
      name: "Tuesday",
      appointments: [3, 4],
      interviewers: [3, 4],
      spots: 1
    }
  ],
  appointments: {
    "1": { id: 1, time: "12pm", interview: null },
    "2": {
      id: 2,
      time: "1pm",
      interview: { student: "Archie Cohen", interviewer: 2 }
    },
    "3": {
      id: 3,
      time: "2pm",
      interview: { student: "Leopold Silvers", interviewer: 4 }
    },
    "4": { id: 4, time: "3pm", interview: null }
  },
  interviewers: {
    "1": {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    },
    "2": {
      id: 2,
      name: "Tori Malcolm",
      avatar: "https://i.imgur.com/Nmx0Qxo.png"
    },
    "3": {
      id: 3,
      name: "Mildred Nazir",
      avatar: "https://i.imgur.com/T2WwVfS.png"
    },
    "4": {
      id: 4,
      name: "Cohana Roy",
      avatar: "https://i.imgur.com/FK8V841.jpg"
    }
  }
};

export default {
  defaults: { baseURL: "" },
  get: jest.fn(url => {
    if (url === "/api/days") {
      return Promise.resolve({
        status: 200,
        statusText: "OK",
        data: fixtures.days
      });
    }

    if (url === "/api/appointments") {
      /* Resolve appointments data */
      return Promise.resolve({
        status: 200,
        statusText: "OK",
        data: fixtures.appointments
      });
    }

    if (url === "/api/interviewers") {
      /* Resolve interviewers data */
      return Promise.resolve({
        status: 200,
        statusText: "OK",
        data: fixtures.interviewers
      });
    }
  }),

  put: jest.fn((data) => {
    //! Test data for webSocket - LHL did not design Compass tests to work with webSocket running
    // We are testing booking an appointment on Monday, id = 1
    // fixtures.appointments[1] = {
    //   interview: {student: data.student, interviewer: data.interviewer}
    // }
    // fixtures.days[0].spots -= 1;
    if (fixtures.days[0].spots === 0) { fixtures.days[0].spots = 1 };
    return Promise.resolve({
      status: 204, 
      statusText: "No Content",
    })
  }),

  delete: jest.fn(() => {
    if (fixtures.days[0].spots === 0) { fixtures.days[0].spots = 1 };
    return Promise.resolve({
      status: 204, 
      statusText: "No Content",
    })
  })
};