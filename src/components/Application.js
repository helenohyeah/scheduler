import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "../helpers/selectors";

// COMPONENTS

import DayList from "./DayList";
import Appointment from "./Appointment";

// STYLING

import "components/Application.scss";

export default function Application(props) {

  // DECLARE STATES
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  // SET STATE
  const setDay = day => setState(prev => ({ ...prev, day }));

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

  // GET DATA FOR COMPONENTS
  const dailyAppointments =  getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);

  // CHANGE LOCAL AND SERVER DATA WHEN BOOKING INTERVIEW
  function bookInterview(id, interview, transition) {
    // CREATE NEW APPOINTMENT WITH UPDATED INTERVIEW DATA
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
    // UPDATE SERVER DATA
    axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
    .then(() => {
      // UPDATE STATE AND TRANSITION TO SHOW
      setState({ ...state, appointments });
      transition("SHOW");
    })
    .catch(err => console.log(err));
  }

  return (
    <main className="layout">
    {console.log('state:', state)}
    {/* {console.log('daily appointments:', dailyAppointments)} */}
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            day={state.day}
            days={state.days}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>

      <section className="schedule">
        {dailyAppointments.map(appointment => {
          console.log('appointment map:', appointment)
          const interview = getInterview(state, appointment.interview)
          return (
          <Appointment
            key={appointment.id}
            id={appointment.id}
            time={appointment.time}
            interview={interview}
            interviewers={interviewers}
            bookInterview={bookInterview}
          />)
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
