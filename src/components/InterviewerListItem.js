import React from "react";
import "components/InterviewListItem.scss";

const classNames = require('classnames');

export default function InterviewListItem(props) {

  const interviewClass = classNames('interviewers__item', {
    'interviewers__item--selected': props.selected,
  });

  return (
    <li 
      id={props.id}
      className={interviewClass}
      selected={props.selected}
      onClick={props.setInterviewer}
    >
      <img
        className='interviewers__item-image'
        src={props.avatar}
        alt={props.name}
      />
      {props.name}
    </li>
  );
}
