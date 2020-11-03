// LIBRARIES
import React from "react";

// CUSTOM HOOKS
import useVisualMode from "../../hooks/useVisualMode";

// COMPONENTS
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

// STYLING
import "./styles.scss";

// MODE VARIABLES
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const EDIT = "EDIT";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
   // DECLARE MODE HANDLER AND SET INITIAL MODE
   const { mode, transition, back } = useVisualMode(
      props.interview ? SHOW : EMPTY
   );

   // SAVE NEW INTERVIEW BOOKING GIVEN NAME AND INTERVIEWER
   function save(name, interviewer) {
      const interview = {
        student: name,
        interviewer
      };

      transition(SAVING);

      props
         .bookInterview(props.id, interview)
         .then(() => transition(SHOW))
         .catch(() => transition(ERROR_SAVE, true));
   }

   // DELETE AN INTERVIEW
   function deleteInterview() {
      transition(DELETING, true);

      props
         .cancelInterview(props.id)
         .then(() => transition(EMPTY))
         .catch(() => transition(ERROR_DELETE, true));
   }

   return (
      <article className="appointment">
         <Header time={props.time} />
         {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
         {mode === SHOW && (
            <Show
               student={props.interview.student}
               interviewer={props.interview.interviewer}
               onDelete={() => transition(CONFIRM)}
               onEdit={() => transition(EDIT)}
            />
         )}
         {mode === CREATE && (
            <Form
               interviewers={props.interviewers}
               onCancel={back}
               onSave={save}
            />
         )}
         {mode === EDIT && (
            <Form
               interviewers={props.interviewers}
               name={props.interview.student}
               value={props.interview.interviewer.id}
               onCancel={back}
               onSave={save}
            />
         )}
         {mode === SAVING && <Status message="Saving" />}
         {mode === DELETING && <Status message="Deleting" />}
         {mode === CONFIRM && (
            <Confirm
               message="Are you sure you want to delete this interview?"
               onCancel={back}
               onConfirm={deleteInterview}
            />
         )}
         {mode === ERROR_SAVE && <Error message="Could not save appointment" onClose={back} />}
         {mode === ERROR_DELETE && <Error message="Could not delete appointment" onClose={back} />}
      </article>
   );
}
