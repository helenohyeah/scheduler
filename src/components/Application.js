// LIBRARIES
import React from "react";

// HELPERS
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "../helpers/selectors";

// CUSTOM HOOKS
import useApplicationData from "../hooks/useApplicationData";

// COMPONENTS
import DayList from "./DayList";
import Appointment from "./Appointment";

// STYLING
import "components/Application.scss";

export default function Application(props) {
  // DATA MANAGEMENT HOOKS
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  // GET DATA FOR COMPONENTS
  const interviewers = getInterviewersForDay(state, state.day);
  const appointments =  getAppointmentsForDay(state, state.day)
    .map(appointment => {
      return (
        <Appointment
          key={appointment.id}
          id={appointment.id}
          time={appointment.time}
          interview={getInterview(state, appointment.interview)}
          interviewers={interviewers}
          bookInterview={bookInterview}
          cancelInterview={cancelInterview}
        />
      );
    }
  );

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
        {appointments}
        {/* {console.log('state:', state)} */}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
