import React from "react";
import axios from "axios";
import { Context } from "../../../contexts/UserProvider";
import { Form, Grid, Segment, Header, Message } from "semantic-ui-react";
import UploadCsv from "./UploadCsv";
import { CONSOLE_LOGGING } from "../../../DevelopmentView";

class AccountCreation extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      emailError: null,
      userCreated: false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, { name, value }) {
    this.setState({ [name]: value, userCreated: false, emailError: null });
  }

  handleSubmit = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.context.token}`
    };
    axios
      .post(
        "../auth/newAccountRequest",
        {
          email: this.state.email
        },
        { headers: headers }
      )
      .then(response => {
        CONSOLE_LOGGING && console.log("POST new account:", response);
        if (response.status === 200) {
          this.setState({ userCreated: true });
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING && console.log("POST new account error:", response);
        let msg;
        switch (response.status) {
          case 400:
            msg = "Account with the specified email already exists.";
            break;
          case 401:
            alert("Your current session has expired. Please log in again.");
            this.context.resetUser();
            break;
          case 422:
            msg = "Please enter a valid email.";
            break;
          default:
            msg = "An unknown error has occurred. Please try again.";
        }
        this.setState({ emailError: { content: msg } });
      });
  };

  render() {
    return (
      <Segment placeholder>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column
            verticalAlign="middle"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Form onSubmit={this.handleSubmit}>
              <Header>Create Account</Header>
              <Form.Input
                error={this.state.emailError}
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                type="email"
              />
              <Form.Button fluid content="Create" primary />
            </Form>
            {this.state.userCreated && (
              <Message
                success
                header="User Created"
                content={`An email has been sent to ${this.state.email} for registration.`}
              />
            )}
          </Grid.Column>
          <Grid.Column
            verticalAlign="middle"
            style={{ display: "flex", alignItems: "center" }}
          >
            <UploadCsv />
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default AccountCreation;
