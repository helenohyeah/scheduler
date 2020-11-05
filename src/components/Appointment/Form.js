import React, { useState } from "react";

import InterviewerList from "../InterviewerList";
import Button from "../Button";

export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.value || null);
  const [error, setError] = useState("");

  // CLEAR INPUT FIELD AND INTERVIEWER IF CANCELED
  const reset = () => {
    setName("");
    setInterviewer(null);
  };

  // CANCEL NEW APPOINTMENT BOOKING
  const cancel = () => {
    reset();
    props.onCancel();
  };

  // CHECK THAT STUDENT NAME IS NOT BLANK
  const validate = () => {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    } else if (interviewer === null) {
      setError("An interviewer must be selected");
      return;
    }

    // IF NOT BLANK SAVE APPOINTMENT
    setError("");
    props.onSave(name, interviewer);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">

        <form autoComplete="off" onSubmit={e => e.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={e => setName(e.target.value)}
            data-testid="student-name-input"
          />
        </form>

        <section className="appointment__validation">{error}</section>

        <InterviewerList
          interviewers={props.interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />

      </section>

      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={validate}>Save</Button>
        </section>
      </section>
    </main>
  );
}