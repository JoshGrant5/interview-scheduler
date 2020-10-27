import React from "react";
import "components/InterviewerListItem.scss";

const classNames = require('classnames');

export default function InterviewListItem(props) {

  const interviewClass = classNames('interviewers__item', {
    'interviewers__item--selected': props.selected,
  });

  const interviewer = () => {
    if (props.selected) return props.name;
  }

  return (
    <li 
      id={props.id}
      className={interviewClass}
      selected={props.selected}
      onClick={() => props.setInterviewer(props.id)}
    >
      <img
        className='interviewers__item-image'
        src={props.avatar}
        alt={props.name}
      /> {interviewer()}
    </li>
  );
}
