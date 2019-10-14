import React from "react";
import logo from "../images/treeckle_startup.png";
import axios from "axios";
import * as yup from "yup";
import { Context } from "../contexts/UserProvider";
import {
  Button,
  Divider,
  Form,
  Grid,
  Segment,
  Image,
  Header
} from "semantic-ui-react";

class CreateAccountAdmin extends React.Component {
  static contextType = Context;
  state = {
    email: "",
    password: "",
    submittedEmail: "",
    submittedPassword: "",
    emailError: null,
    passwordError: null
  };

  constructor(props) {
    super(props);
    this.handleForgot = this.handleForgot.bind(this);
  }

  InputSchema = yup.object().shape({
    email: yup
      .string()
      .email()
      .required(),
    password: yup.string().required()
  });

  EmailSchema = yup.object().shape({
    email: yup
      .string()
      .email()
      .required()
  });

  PasswordSchema = yup.object().shape({
    password: yup.string().required()
  });

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = () => {
    const { email, password } = this.state;
    this.setState({
      submittedEmail: email,
      submittedPassword: password,
      emailError: null,
      passwordError: null
    });
    console.log(this.state.email, this.state.password);
    let inputData = { email: this.state.email, password: this.state.password };
    this.InputSchema.isValid(inputData).then(valid => {
      if (valid) {
        console.log("yell hea!");
        //TODO axios POST
      } else {
        this.EmailSchema.isValid(inputData).then(valid => {
          if (!valid) {
            this.setState({
              emailError: { content: "Please enter a valid email." }
            });
          }
        });
        this.PasswordSchema.isValid(inputData).then(valid => {
          if (!valid) {
            this.setState({
              passwordError: { content: "Please enter your password." }
            });
          }
        });
      }
    });
  };

  handleForgot() {
    this.context.setUser(-2, "");
  }

  render() {
    const {
      email,
      password,
      submittedEmail,
      submittedPassword,
      emailError,
      passwordError
    } = this.state;
    return (
      <Segment placeholder>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column verticalAlign="middle">
            <Header style={{ margin: "1.5em auto" }}>Create Account</Header>
            <Form onSubmit={this.handleSubmit}>
              <Form.Input
                error={emailError}
                icon="user"
                iconPosition="left"
                placeholder="Email"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
              <Button
                content="Create"
                primary
                style={{ minWidth: "210px", margin: "1em auto" }}
              />
            </Form>
          </Grid.Column>
          <Grid.Column verticalAlign="middle">
            <Button
              content="Upload .csv"
              secondary
              style={{ minWidth: "210px", margin: "1em auto" }}
            />
          </Grid.Column>
        </Grid>

        {<Divider vertical>OR</Divider>}
      </Segment>
    );
  }
}

export default CreateAccountAdmin;
