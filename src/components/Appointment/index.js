import React from "react";
import useVisualMode from "../../hooks/useVisualMode";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";

import "./styles.scss";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";

export default function Appointment(props) {
   // DECLARE MODE HANDLER AND SET INITIAL MODE
   const { mode, transition, back } = useVisualMode(
      props.interview ? SHOW : EMPTY
   );

   // CAPTURE NAME AND INTERVIEWER WHEN SAVING A NEW BOOKING
   function save(name, interviewer) {
      const interview = {
        student: name,
        interviewer
      };
      transition(SAVING);
      props.bookInterview(props.id, interview, transition);
   }

   // DELETE AN INTERVIEW
   function deleteInterview() {
      transition(DELETING);
      props.cancelInterview(props.id, transition);
   }

   return (
      <article className="appointment">
         <Header
            time={props.time}
         />
         {mode === EMPTY && (
            <Empty
               onAdd={() => transition(CREATE)}
            />
         )}
         {mode === SHOW && (
            <Show
               student={props.interview.student}
               interviewer={props.interview.interviewer}
               deleteInterview={deleteInterview}
            />
         )}
         {mode === CREATE && (
            <Form
               interviewers={props.interviewers}
               onCancel={() => back()}
               onSave={save}
            />
         )}
         {mode === SAVING && (
            <Status
               message="Saving"
            />
         )}
         {mode === DELETING && (
            <Status
               message="Deleting"
            />
         )}
      </article>
   );
}
