import React, { useState } from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const ERROR_SAVE = "ERROR_S";
  const ERROR_DELETE = "ERROR_D";

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

  const [editName, setEditName] = useState('');
  const [editInterviewer, setEditInterviewer] = useState(null);

  const edit = (name, interviewer) => {
    setEditName(name);
    setEditInterviewer(interviewer);
    transition(CREATE);
  }
  
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
          onEdit={edit}
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
      {mode === ERROR_SAVE && (<Error message="Could not save appointment" onClose={back} />)}
      {mode === DELETING && (<Status message="Deleting" />)}
      {mode === ERROR_DELETE && (<Error message="Coult not delete appointment" onClose={back} />)}
      {mode === CREATE && (
        <Form
          name={editName}
          interviewers={props.interviewers}
          value={editInterviewer}
          onSave={save}
          onCancel={() => back()} 
        />
      )}
    </article>
  );
}