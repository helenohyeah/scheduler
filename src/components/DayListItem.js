import React from "react";
import classnames from "classnames";

import "components/DayListItem.scss";

export default function DayListItem(props) {
  let dayListClass = classnames("day-list__item",{
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  })

  const formatSpots = (num) => {
    switch(num) {
      case 0:
        return 'no spots remaining';
      case 1:
        return '1 spot remaining';
      default:
        return num + ' spots remaining';
    }
  };

  return (
    <li 
      className={dayListClass}  
      onClick={() => props.setDay(props.name)}
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}