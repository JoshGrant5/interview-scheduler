import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";

import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM"

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview, transition);
  };

  const deleteInterview = () => {
    transition(DELETING);
    props.cancelInterview(props.id, transition);
  };

  const confirmDelete = () => {
    transition(CONFIRM);
  };
  
  return (
    <article className="appointment">
      <Header
        time={props.time}
      />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirmDelete}
        />
      )}
      {mode === SAVING && (<Status message="Saving" />)}
      {mode === CONFIRM && (
      <Confirm 
      message="Are you sure you'd like to delete?" 
      onConfirm={deleteInterview}
      />
      )}
      {mode === DELETING && (<Status message="Deleting" />)}
      {mode === CREATE && (
        <Form
          // name={props.name}
          interviewers={props.interviewers}
          // value={props.value}
          onSave={save}
          onCancel={() => back()} 
        />
      )}
    </article>
  );
}