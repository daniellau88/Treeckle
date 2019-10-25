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
  Header,
  Message
} from "semantic-ui-react";

class LoginDivider extends React.Component {
  static contextType = Context;
  state = {
    email: "",
    password: "",
    submittedEmail: "",
    submittedPassword: "",
    emailError: null,
    passwordError: null,
    invalidUserError: false
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
        axios
          .post("/auth/accounts", {
            email: this.state.email,
            password: this.state.password
          })
          .then(res => {
            if (res.status === 200) {
              const token = res.data.token;
              const name = res.data.name;
              const profilePic = res.data.profilePic.data;
              const role = res.data.role;
              this.context.setUser(token, name, profilePic, role);
            }
          })
          .catch(err => {
            this.setState({
              invalidUserError: true
            });
            console.log(err);
          });
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
    this.context.setUser(-2, "", "");
  }

  render() {
    const {
      email,
      password,
      submittedEmail,
      submittedPassword,
      emailError,
      passwordError,
      invalidUserError
    } = this.state;
    return (
      <Segment placeholder>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column verticalAlign="middle">
            <Header style={{ margin: "1.5em auto" }}>Sign in</Header>
            <Form error onSubmit={this.handleSubmit}>
              <Form.Input
                transparent
                error={emailError}
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
              <Form.Input
                transparent
                error={passwordError}
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
              {invalidUserError && (
                <Message
                  error
                  content="Incorrect email/password."
                  style={{ maxWidth: "210px", margin: "1em auto" }}
                />
              )}
              <div style={{ margin: "1em auto" }}>
                <a onClick={this.handleForgot} style={{ cursor: "pointer" }}>
                  Forgot password?
                </a>
              </div>
              <Button
                content="Login"
                primary
                style={{ minWidth: "210px", margin: "1em auto" }}
              />
            </Form>
          </Grid.Column>
          <Grid.Column
            verticalAlign="middle"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Image
              src={logo}
              style={{
                margin: "2.5em",
                width: "85%",
                height: "auto",
                display: "block"
              }}
            />
          </Grid.Column>
        </Grid>

        {/* <Divider vertical></Divider> */}
      </Segment>
    );
  }
}

export default LoginDivider;
