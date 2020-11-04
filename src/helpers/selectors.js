// Returns an array of appointments for that day
const getAppointmentsForDay = (state, day) => {
  let appointments = [];
  let schedule = [];
  for (let item in state.days) {
    if (state.days[item].name === day) {
      schedule = state.days[item].appointments;
    }
  }
  for (let appointment in state.appointments) {
    if (schedule.includes(state.appointments[appointment].id)) {
      appointments.push(state.appointments[appointment]);
    }
  }
  return appointments;
}

// Returns an interview object
const getInterview = (state, interview) => {
  let info = {};
  if (!interview) {
    return null;
  }
  info["student"] = interview.student;
  info["interviewer"] = {id: interview.interviewer};
  for (let interviewer in state.interviewers) {
    if (state.interviewers[interviewer].id === interview.interviewer) {
      info["interviewer"] = {...info.interviewer, name: state.interviewers[interviewer].name};
      info["interviewer"] = {...info.interviewer, avatar: state.interviewers[interviewer].avatar};
    }
  }
  return info;
};

// Returns an array of interviewers for the day
const getInterviewersForDay = (state, day) => {
  let schedule = [];
  let interviewers = [];
  for (let item in state.days) {
    if (state.days[item].name === day) {
      schedule = state.days[item].interviewers;
    }
  }
  for (let interviewer in state.interviewers) {
    if (schedule.includes(state.interviewers[interviewer].id)) {
      interviewers.push(state.interviewers[interviewer]);
    }
  }
  return interviewers;
}

export { getAppointmentsForDay, getInterview, getInterviewersForDay };