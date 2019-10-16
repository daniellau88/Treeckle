import React from "react";
import { Segment } from "semantic-ui-react";

const StatusBar = props => {
  const renderColor = () => {
    if (props.submitting) {
      return "grey";
    } else if (props.status.success) {
      return "green";
    } else {
      return "red";
    }
  };

  return (
    <Segment
      textAlign="center"
      inverted
      loading={props.submitting}
      color={renderColor()}
    >
      {props.status.message}
    </Segment>
  );
};

export default StatusBar;
