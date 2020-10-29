export function getAppointmentsForDay(state, day) {
  // Make a copy of state data
  const days = [...state.days];
  const appointments = {...state.appointments};

  let results = [];

  // Get appointments for given day
  const filteredDay = days.filter(item => item.name === day);
  // If the day has no appointments, set appointmentIds to an empty array
  const appointmentIds = (filteredDay.length !== 0) ? filteredDay[0].appointments : [];

  // Loop through appointments, if its in the given day, add it to results
  for (const appointment in appointments) {
    if (appointmentIds.includes(appointments[appointment].id)) {
      results.push(appointments[appointment]);
    }
  }

  return results;
};