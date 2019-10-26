import React from "react";
import Axios from "axios";
import { Context } from "../../contexts/UserProvider";
import { Button, Popup } from "semantic-ui-react";
import { CONSOLE_LOGGING } from "../../DevelopmentView";

class StatusButton extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = { isOpen: false };

    this.togglePopup = this.togglePopup.bind(this);
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

    return (
      <Button
        color={color}
        content={statusLabel}
        disabled={statusLabel === "Cancelled"}
      />
    );
  }

  updateBookingRequest(newStatus) {
    const data = {
      id: this.props.bookingId,
      approved: newStatus
    };
    Axios.patch("api/rooms/bookings/manage", data, {
      headers: { Authorization: `Bearer ${this.context.token}` }
    })
      .then(response => {
        CONSOLE_LOGGING && console.log("PATCH update status:", response);
        if (response.status === 200) {
          this.props.updateTable();
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING && console.log("PATCH update status error:", response);
        if (response.status === 401) {
          alert("Your current session has expired. Please log in again.");
          this.context.resetUser();
        }
      });
  }

  cancelBookingRequest() {
    const data = {
      id: this.props.bookingId
    };
    Axios.patch("api/rooms/bookings", data, {
      headers: { Authorization: `Bearer ${this.context.token}` }
    })
      .then(response => {
        CONSOLE_LOGGING && console.log("PATCH cancel booking:", response);
        if (response.status === 200) {
          this.props.updateTable();
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING && console.log("PATCH cancel booking error:", response);
        if (response.status === 401) {
          alert("Your current session has expired. Please log in again.");
          this.context.resetUser();
        }
      });
  }

  renderOptions() {
    const status = this.props.status;
    return (
      <div style={{ flexDirection: "column", display: "flex" }}>
        {!this.props.cancellable && (status === 0 || status === 2) && (
          <Button
            color="green"
            content="Approve"
            onClick={() => {
              this.updateBookingRequest(1);
              this.togglePopup();
            }}
            style={{ margin: "0.25rem 0" }}
          />
        )}
        {!this.props.cancellable && (status === 1 || status === 2) && (
          <Button
            color="orange"
            content="Revoke"
            onClick={() => {
              this.updateBookingRequest(0);
              this.togglePopup();
            }}
            style={{ margin: "0.25rem 0" }}
          />
        )}
        {!this.props.cancellable && (status === 0 || status === 1) && (
          <Button
            color="red"
            content="Reject"
            onClick={() => {
              this.updateBookingRequest(2);
              this.togglePopup();
            }}
            style={{ margin: "0.25rem 0" }}
          />
        )}
        {this.props.cancellable && (
          <Button
            color="red"
            content="Cancel"
            onClick={() => {
              this.cancelBookingRequest();
              this.togglePopup();
            }}
            style={{ margin: "0.25rem 0" }}
          />
        )}
      </div>
    );
  }

  togglePopup() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <Popup
        trigger={this.renderStatusButton()}
        on="click"
        content={this.renderOptions()}
        position="bottom center"
        open={this.state.isOpen}
        onOpen={this.togglePopup}
        onClose={this.togglePopup}
        disabled={this.props.status === 3}
      />
    );
  }
}

export default StatusButton;
