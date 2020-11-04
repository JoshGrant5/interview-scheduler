import React, { useState, useEffect } from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

import useVisualMode from "hooks/useVisualMode";

// Appointment component - shows the appointments and slots for each day with applicable components
export default function Appointment(props) {

  // Different modes for transitioning between components 
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

  const [editName, setEditName] = useState('');
  const [editInterviewer, setEditInterviewer] = useState(null);

  // Helper functions for saving, editing, and deleting an appointment
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(() => transition("ERROR_S", true));
  };

  const edit = (name, interviewer) => {
    setEditName(name);
    setEditInterviewer(interviewer);
    transition(CREATE);
  }

  const deleteInterview = () => {
    transition(DELETING);
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(() => transition("ERROR_S", true));
  };

  // If websocket is running, transition the mode state (for if multiple browsers are runnning)
  useEffect(() => {
    if (props.interview && mode === EMPTY) {
     transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
     transition(EMPTY);
    }
  }, [props.interview, transition, mode]);
  
  return (
    <article className="appointment" data-testid="appointment">
      <Header
        time={props.time}
      />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={edit}
          onDelete={() => transition(CONFIRM)}
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