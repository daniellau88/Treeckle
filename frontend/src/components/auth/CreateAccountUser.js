import React from "react";
import { withRouter } from "react-router";
import logo from "../../images/treeckle_startup.png";
import Axios from "axios";
import * as yup from "yup";
import { Context } from "../../contexts/UserProvider";
import { Button, Form, Grid, Segment, Image, Header } from "semantic-ui-react";

class CreateAccountUser extends React.Component {
  static contextType = Context;
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      passwordRepeated: "",
      submittedEmail: "",
      submittedPassword: "",
      emailError: null,
      passwordError: null,
      userCreated: false
    };
  }

  InputSchema = yup.object().shape({
    email: yup
      .string()
      .email()
      .required(),
    password: yup.string().required(),
    passwordRepeated: yup.string().when("password", {
      is: val => (val && val.length > 0 ? true : false),
      then: yup
        .string()
        .oneOf([yup.ref("password")], "Both password need to be the same")
    })
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

  PasswordRepeatSchema = yup.object().shape({
    confirmPassword: yup
      .string()
      .required()
      .label("Confirm password")
      .test("passwords-match", "Passwords must match", function(value) {
        return this.parent.password === value;
      })
  });

  handleChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = () => {
    console.log();

    if (this.state.password != this.state.passwordRepeated) {
      return;
    }

    const { email, password } = this.state;
    this.setState({
      submittedEmail: email,
      submittedPassword: password,
      emailError: null,
      passwordError: null
    });
    console.log(this.state.email, this.state.password);
    let inputData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
    };
    this.InputSchema.isValid(inputData).then(valid => {
      if (valid) {
        console.log("yell hea!" + this.context.token);
        if (this.props.match.params.uniqueId === undefined) {
          //Used for pilot test
          Axios.post("/auth/newAccountsDirect", {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
          })
            .then(res => {
              if (res.status === 200) {
                this.setState({ userCreated: true });
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          Axios.post("/auth/newAccounts", {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            uniqueURIcomponent: this.props.match.params.uniqueId
          })
            .then(res => {
              if (res.status === 200) {
                this.setState({ userCreated: true });
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
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

  areValidFields() {
    return (
      this.state.name &&
      this.state.email &&
      this.state.password.length >= 8 &&
      this.state.password === this.state.passwordRepeated
    );
  }

  render() {
    const {
      name,
      email,
      password,
      passwordRepeated,
      submittedEmail,
      submittedPassword,
      emailError,
      passwordError,
      userCreated
    } = this.state;
    return (
      <Segment placeholder>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column verticalAlign="middle">
            <Header style={{ margin: "1.5em auto" }}>Create account</Header>
            <Form onSubmit={this.handleSubmit}>
              <Form.Input
                icon="user"
                iconPosition="left"
                placeholder="Name"
                name="name"
                value={name}
                onChange={this.handleChange}
                disabled={userCreated}
              />
              <Form.Input
                error={emailError}
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                name="email"
                value={email}
                onChange={this.handleChange}
                disabled={userCreated}
              />
              <Form.Input
                error={passwordError}
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
                disabled={userCreated}
              />
              <Form.Input
                icon="lock"
                iconPosition="left"
                placeholder="Confirm Password"
                type="password"
                name="passwordRepeated"
                value={passwordRepeated}
                onChange={this.handleChange}
                disabled={userCreated}
              />

              {!userCreated && password && password.length < 8 && (
                <div style={{ color: "red" }}>
                  Password is less than 8 characters
                </div>
              )}

              {!userCreated && password && passwordRepeated && (
                <div style={{ color: "red" }}>
                  {password === passwordRepeated
                    ? "Passwords match"
                    : "Passwords don't match"}
                </div>
              )}

              <Button
                content={userCreated ? "User Created" : "Create"}
                primary={!userCreated}
                secondary={userCreated}
                style={{ minWidth: "210px", margin: "1em auto" }}
                disabled={!this.areValidFields() || userCreated}
              />
            </Form>
            {this.state.userCreated && (
              <Button
                fluid
                content="Login here"
                onClick={() => this.props.history.push("/")}
                primary
              />
            )}
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
      </Segment>
    );
  }
}

export default withRouter(CreateAccountUser);
