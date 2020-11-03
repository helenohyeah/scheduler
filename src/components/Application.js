// PACKAGES
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
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  // GET DATA FOR COMPONENTS
  const dailyAppointments =  getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);

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
          // console.log('appointment map:', appointment)
          const interview = getInterview(state, appointment.interview)
          return (
          <Appointment
            key={appointment.id}
            id={appointment.id}
            time={appointment.time}
            interview={interview}
            interviewers={interviewers}
            bookInterview={bookInterview}
            cancelInterview={cancelInterview}
          />)
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
