import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header.jsx";
import Show from "components/Appointment/Show.jsx";
import Empty from "components/Appointment/Empty.jsx";

export default function Appointment(props) {
  
  return (
    <article className="appointment">
      <Header
        time={props.time}
      />
      {props.interview ? 
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
      /> 
      : 
      <Empty />
      }
    </article>
  );
}