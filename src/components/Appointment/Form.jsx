import React, { useState } from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";

// Form component - user can create a new account
export default function Form(props) {

  const [name, setName] = useState(props.name || '');
  const [interviewer, setInterviewer] = useState(props.value || null);
  const [error, setError] = useState("");

  // Helper functions for reseting the name and interviewer state on cancel
  const reset = () => {
    setName('');
    setInterviewer(null);
  };

  const cancel = () => {
    reset();
    props.onCancel();
  };

  // Helper function for validating that 
  const validate = () => {
    if (!name) {
      setError("Student name cannot be blank");
      return;
    } else if (!interviewer) { 
      setError("Interviewer cannot be blank")
    }
    setError("");
    props.onSave(name, interviewer);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={event => setName(event.target.value)}
            data-testid="student-name-input"
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList
          interviewers={props.interviewers} 
          value={interviewer} 
          onChange={setInterviewer} 
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={cancel} danger>Cancel</Button>
          <Button onClick={validate} confirm>Save</Button>
        </section>
      </section>
    </main>
  );
}