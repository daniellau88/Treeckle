import React from "react";
import { Message } from "semantic-ui-react";

const StatusBar = props => {
  const renderColor = () => {
    if (props.submitting) {
      return "blue";
    } else if (props.status.success) {
      return "green";
    } else {
      return "red";
    }
  };

  return (
    <Message
      floating
      textAlign="center"
      color={renderColor()}
      header={props.status ? props.status.message : "Submission in progress"}
    />
  );
};

export default StatusBar;
