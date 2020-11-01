import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "../helpers/selectors";

// Components

import DayList from "./DayList";
import Appointment from "./Appointment";

// Styling

import "components/Application.scss";
import InterviewerList from "./InterviewerList";

export default function Application(props) {

  // Declare States
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });
  
  // const dailyAppointments = [];
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  // Setting States
  const setDay = day => setState(prev => ({ ...prev, day }));

  // Get Data
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      // axios.get("http://localhost:8001/api/interviewers")
    ]).then(data => {
        setState(prev => ({...prev, days: data[0].data, appointments: data[1].data}));
    }).catch(err => console.log(err))
  }, []);

  return (
    <main className="layout">
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
          return <Appointment
            key={appointment.id}
            {...appointment}
          />
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
