import React from "react";
import "components/InterviewerList.scss";
import InterviewerListItem from "components/InterviewerListItem";
import "components/InterviewerListItem.scss";

export default function InterviewerList(props) {

  const interviewers = props.interviewers.map(interviewer => {
    return (
      <InterviewerListItem
        id={interviewer.id}
        avatar={interviewer.avatar}
        name={interviewer.name}
        selected={props.interviewer === interviewer.id}
        setInterviewer={props.setInterviewer}
      />
    );
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewers}</ul>
    </section>
  );
}