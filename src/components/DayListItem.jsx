import React from "react";
import "components/DayListItem.scss";

import classNames from 'classnames';

export default function DayListItem(props) {

  const dayClass = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'text--light': props.spots,
    'day-list__item--full': props.spots === 0,
    'text--regular': props.name
  });

  const formatSpots = spots => {
    if (spots === 1) {
      return `${spots} spot remaining`;
    } else {
      return (spots === 0 ? 'no spots remaining' : `${spots} spots remaining`);
    }
  };

  return (
    <li onClick={() => props.setDay(props.name)} >
      <div className={dayClass} data-testid="day" >
        <h2>{props.name}</h2> 
        <h3>{formatSpots(props.spots)}</h3>
      </div>
    </li>
  );
}