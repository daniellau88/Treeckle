import React from "react";
import Axios from "axios";
import { Context } from "../../contexts/UserProvider";
import { Button, Popup } from "semantic-ui-react";

class StatusButton extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 0 => pending, 1 => approved, 2 => rejected, 3 => cancelled
  renderStatusButton() {
    var color;
    var statusLabel;

    switch (this.props.status) {
      case 0:
        color = "orange";
        statusLabel = "Pending";
        break;
      case 1:
        color = "green";
        statusLabel = "Approved";
        break;
      case 2:
        color = "red";
        statusLabel = "Rejected";
        break;
      case 3:
        color = "black";
        statusLabel = "Cancelled";
        break;
      default:
        color = "standard";
        statusLabel = "Unknown";
    }

    return <Button basic color={color} content={statusLabel} />;
  }

  renderOptions() {
    return (
      <div style={{ flexDirection: "column", display: "flex" }}>
        {!this.props.cancellable && this.props.status === 0 && (
          <Button
            color="green"
            content="Approve"
            onClick={() => console.log("Approve")}
            style={{ marginBlockEnd: "0.25em" }}
          />
        )}
        {!this.props.cancellable && this.props.status === 1 && (
          <Button
            color="orange"
            content="Revoke"
            onClick={() => console.log("Revoke")}
            style={{ marginBlockEnd: "0.25em" }}
          />
        )}
        {!this.props.cancellable && this.props.status !== 2 && (
          <Button
            color="red"
            content="Reject"
            onClick={() => console.log("Reject")}
            style={{ marginBlockStart: "0.25em" }}
          />
        )}
        {this.props.cancellable && (
          <Button
            color="red"
            content="Cancel"
            onClick={() => console.log("Cancel")}
            style={{ marginBlockStart: "0.25em" }}
          />
        )}
      </div>
    );
  }

  render() {
    return (
      <Popup
        trigger={this.renderStatusButton()}
        on="click"
        content={this.renderOptions()}
        position="right center"
      />
    );
  }
}

export default StatusButton;
