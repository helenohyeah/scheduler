import React from "react";
import useVisualMode from "../../hooks/useVisualMode";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

import "./styles.scss";

const EMPTY = "EMPTY";
const SHOW = "SHOW";

export default function Appointment(props) {
   // Declare VisualMode functions and set initial mode
   const { mode, transition, back } = useVisualMode(
      props.interview ? SHOW : EMPTY
   );

   return (
      <article className="appointment">
         <Header
            time={props.time}
         />
         {mode === EMPTY && (
            <Empty
               onAdd={() => console.log("Clicked onAdd")} 
            />
         )}
         {mode === SHOW && (
            <Show
               student={props.interview.student}
               interviewer={props.interview.interviewer} 
            />
         )}
      </article>
   );
}
