import React, { useEffect } from 'react';
import './styles.scss';

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import ErrorComponent from "./ErrorComponent";
import useVisualMode from "hooks/useVisualMode";



const Appointment = function(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  // Runs when user clicks save button on the booking form
  // Transitions to STATUS with a loading spinner, makes an axios request, and transitions to SHOW when resolved
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch((err) => {
        transition(ERROR_SAVE, true);
      });
  }

  // Runs when user clicks the delete button followed by 'confirm' on the SHOW view
  // Transitions to STATUS with a loading spinner, makes an axios request, and transitions to EMPTY when resolved
  function cancelAppointment() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch((err) => {
        transition(ERROR_DELETE, true);
      });
  }

  // Updates views for clients connected through websockets
  useEffect(() => {
    if (mode === EMPTY && props.interview) {
      transition(SHOW);
    } 
    if (mode === SHOW && !props.interview) {
      transition(EMPTY);
    }
  });

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />)}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={(name, interviewer) => save(name, interviewer)}
          onCancel={() => back()}
        />)}
      {mode === SAVING && (
        <Status
          message="Saving"
        />)}
      {mode === DELETING && (
        <Status
          message="Deleting"
        />)}
      {mode === CONFIRM && (
        <Confirm
          message="Delete appointment?"
          onCancel={() => back()}
          onConfirm={() => cancelAppointment()}
        />)}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={(name, interviewer) => save(name, interviewer)}
          onCancel={() => back()}
        />)}
      {mode === ERROR_SAVE && (
        <ErrorComponent
          message="Could not save"
          onClose={() => back()}
        />)}
      {mode === ERROR_DELETE && (
        <ErrorComponent
          message="Could not delete"
          onClose={() => back()}
        />)}
    </article>
  );
};

export default Appointment;

