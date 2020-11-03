import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
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

  // SET STATE
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // SET DAY IN SIDEBAR
  const setDay = day => setState(prev => ({ ...prev, day }));

  // BOOK AN INTERVIEW GIVEN APPOINTMENT AND INTERVIEW DATA
  function bookInterview(id, interview) {
    // UPDATE APPOINTMENT WITH INTERVIEW DATA
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    console.log('appointment:', appointment)
    // UPDATE APPOINTMENTS WITH NEW APPOINTMENT DATA
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    // UPDATE SERVER AND LOCAL DATA
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => setState({ ...state, appointments }));
  }

  // CANCEL AN INTERVIEW GIVEN APPOINTMENT
  function cancelInterview(id) {
    // UPDATE APPOINTMENT WITH NO INTERVIEW
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    // UPDATE APPOINTMENTS WITH NEW APPOINTMENT DATA
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    // UPDATE SERVER AND LOCAL DATA THEN TRANSITION
    return axios.delete(`http://localhost:8001/api/appointments/${id}`, { interview: null })
      .then(() => setState({ ...state, appointments }));
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}