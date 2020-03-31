import React from "react";
import axios from "axios";
import { Context } from "../../../contexts/UserProvider";
import { Button, Form, Segment, Message } from "semantic-ui-react";
import { CONSOLE_LOGGING } from "../../../DevelopmentView";

class AdminConfig extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      errorMsg: "",
      isDisabled: true,
      isLoading: true
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.toggleField = this.toggleField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios
      .get("../api/emails", {
        headers: { Authorization: `Bearer ${this.context.token}` }
      })
      .then(response => {
        CONSOLE_LOGGING && console.log("GET CC email:", response);
        if (response.status === 200) {
          this.setState({ email: response.data.email, isLoading: false });
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING && console.log("GET CC email error:", response);
        switch (response.status) {
          case 401:
            alert("Your current session has expired. Please log in again.");
            this.context.resetUser();
            break;
          case 404:
            this.setState({ isLoading: false });
            break;
          default:
            this.setState({
              errorMsg: "An unknown error has occurred.",
              isLoading: false
            });
        }
      });
  }

  handleEmailChange(event, { value }) {
    CONSOLE_LOGGING && console.log("Email changed:", value);
    this.setState({ email: value, errorMsg: "" });
  }

  toggleField() {
    this.setState({ isDisabled: !this.state.isDisabled, error: "" });
  }

  handleSubmit() {
    axios
      .put(
        "../api/emails",
        {
          email: this.state.email
        },
        { headers: { Authorization: `Bearer ${this.context.token}` } }
      )
      .then(response => {
        CONSOLE_LOGGING && console.log("PUT update CC email:", response);
        if (response.status === 200) {
          this.toggleField();
          alert(
            "CC email updated! Now all receipts will be sent to the specified email."
          );
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING && console.log("PUT update CC email error:", response);
        switch (response.status) {
          case 401:
            alert("Your current session has expired. Please log in again.");
            this.context.resetUser();
            break;
          case 422:
            this.setState({ errorMsg: "Invalid email." });
            break;
          default:
            this.setState({
              errorMsg: "An unknown error has occurred. Please try again."
            });
        }
      });
  }

  render() {
    return (
      <Segment placeholder>
        <Form onSubmit={this.handleSubmit}>
          <h4>
            The below email is assigned to receive receipts for the creation or
            change in status of all bookings.
          </h4>
          <Form.Input
            placeholder="Enter a CC email"
            loading={this.state.isLoading}
            value={this.state.email}
            onChange={this.handleEmailChange}
            disabled={this.state.isDisabled}
            type="email"
          />
          {this.state.errorMsg && (
            <Message
              error
              content={this.state.errorMsg}
              style={{
                display: "block",
                maxWidth: "210px",
                margin: "1em auto"
              }}
            />
          )}
          <div style={{ justifyContent: "center", display: "flex" }}>
            <Button.Group>
              <Button
                secondary
                content="Edit CC email"
                onClick={this.toggleField}
                style={{ border: "1px solid #dfdfdf" }}
                type="button"
              />
              <Button
                primary
                content="Confirm"
                disabled={this.state.isDisabled}
                type="submit"
                style={{ border: "1px solid #dfdfdf" }}
              />
            </Button.Group>
          </div>
        </Form>
      </Segment>
    );
  }
}

/*

            <Button.Group >
              <Form.Button
                secondary
                content="Edit CC email"
                onClick={this.toggleField}
                style={{ border: "1px solid #dfdfdf" }}
              />
              <Form.Button
                primary
                content="Confirm"
                disabled={emailError || disabled}
                onClick={this.handleSubmit}
                style={{ border: "1px solid #dfdfdf" }}
              />
            </Button.Group>
          </div>
          */

export default AdminConfig;
