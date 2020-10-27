import React from "react";
import classnames from "classnames";

import "components/InterviewerListItem.scss";

export default function InterviewerListItem(props) {
  let listClass = classnames("interviewers__item", {
    "interviewers__item--selected": props.selected
  });
  let imgClass = classnames("interviewers__item-image", {
    "interviewers__item-image--selected": props.selected
  })
  
  return (
    <li className={listClass} onClick={props.setInterviewer}>
      <img
        className={imgClass}
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}
