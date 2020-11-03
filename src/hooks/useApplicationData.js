import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  // SET STATE
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // GET SERVER DATA ON LOAD
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
    ]).then(data => {
        setState(prev => ({...prev, days: data[0].data, appointments: data[1].data, interviewers: data[2].data}));
    }).catch(err => console.log(err))
  }, []);

  // SET DAY IN SIDEBAR
  const setDay = day => setState(prev => ({ ...prev, day }));

  // RETURN DAYS OBJECT WITH SPOTS UPDATED GIVEN APPOINTMENT ID AND WHETHER BOOKING OR NOT
  function updateSpots(id, isBooking) {
    const days = [ ...state.days ];
    for (const day of days) {
      if (day.appointments.includes(id)) {
        (isBooking) ? day.spots-- : day.spots++;
      }
    }
    return days;
  }

  // BOOK AN INTERVIEW GIVEN APPOINTMENT AND INTERVIEW DATA
  function bookInterview(id, interview) {
    // UPDATE DATA
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const days = updateSpots(id, true);

    // UPDATE SERVER AND LOCAL WITH NEW DATA
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => setState({ ...state, days, appointments }));
  }

  // CANCEL AN INTERVIEW GIVEN APPOINTMENT
  function cancelInterview(id) {
    // UPDATE DATA
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const days = updateSpots(id, false);

    // UPDATE SERVER AND LOCAL DATA WITH NEW DATA
    return axios.delete(`http://localhost:8001/api/appointments/${id}`, { interview: null })
      .then(() => setState({ ...state, days, appointments }));
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}