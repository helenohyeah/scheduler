import React, { useState, useEffect } from "react";
import axios from "axios";

// Components

import DayList from "./DayList";
import Appointment from "./Appointment";

// Styling

import "components/Application.scss";

export default function Application(props) {

  // States
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });
  
  const dailyAppointments= [];

  // Setting states
  const setDay = day => setState(prev => ({ ...prev, day }));
  const setDays = days => setState(prev => ({ ...prev, days })); 

  // Get data
  useEffect(() => {
    axios.get("http://localhost:8001/api/days")
      .then(res => {
        // setDays(res.data);
        setDays(res.data);
      })
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
