import React from "react";
import axios from "axios";
import { Context } from "../../../contexts/UserProvider";
import { Button, Popup } from "semantic-ui-react";
import { CONSOLE_LOGGING } from "../../../DevelopmentView";

class ChangeRoleButton extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = { isOpen: false };

    this.togglePopup = this.togglePopup.bind(this);
  }

  updateRole(newRole) {
    const data = {
      name: this.props.name,
      email: this.props.email,
      role: newRole
    };
    axios
      .patch("../api/accounts", data, {
        headers: { Authorization: `Bearer ${this.context.token}` }
      })
      .then(response => {
        CONSOLE_LOGGING && console.log("PATCH update user role", response);
        if (response.status === 200) {
          this.props.updateTable();
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING &&
          console.log("PATCH update user role error", response);
        if (response.status === 401) {
          alert("Your current session has expired. Please log in again.");
          this.context.resetUser();
        }
      });
  }

  renderOptions() {
    const role = this.props.role;
    return (
      <div style={{ flexDirection: "column", display: "flex" }}>
        {role !== "Admin" && (
          <Button
            secondary
            content="Make Admin"
            onClick={() => {
              this.updateRole("Admin");
              this.togglePopup();
            }}
            style={{ margin: "0.25rem 0" }}
          />
        )}
        {role !== "Organiser" && (
          <Button
            secondary
            content="Make Organiser"
            onClick={() => {
              this.updateRole("Organiser");
              this.togglePopup();
            }}
            style={{ margin: "0.25rem 0" }}
          />
        )}
        {role !== "Resident" && (
          <Button
            secondary
            content="Make Resident"
            onClick={() => {
              this.updateRole("Resident");
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
        trigger={
          <Button basic color="green">
            Change role
          </Button>
        }
        on="click"
        content={this.renderOptions()}
        position="bottom center"
        open={this.state.isOpen}
        onOpen={this.togglePopup}
        onClose={this.togglePopup}
      />
    );
  }
}

export default ChangeRoleButton;
