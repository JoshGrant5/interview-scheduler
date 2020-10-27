export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
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