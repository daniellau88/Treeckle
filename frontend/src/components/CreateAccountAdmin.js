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

class CreateAccountAdmin extends React.Component {
  static contextType = Context;
  state = {
    email: "",
    submittedEmail: "",
    emailError: null,
    userCreated: false
  };

  constructor(props) {
    super(props);
    this.handleForgot = this.handleForgot.bind(this);
  }

  InputSchema = yup.object().shape({
    email: yup
      .string()
      .email()
      .required()
  });

  EmailSchema = yup.object().shape({
    email: yup
      .string()
      .email()
      .required()
  });


  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = () => {
    const { email } = this.state;
    this.setState({
      submittedEmail: email,
      emailError: null
    });
    console.log(this.state.email);
    let inputData = { email: this.state.email };
    this.InputSchema.isValid(inputData).then(valid => {
      if (valid) {
        console.log("yell hea!");
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGEzMzVmZWU2YThkOTM2NDBlNjAzZjgiLCJwZXJtaXNzaW9uTGV2ZWwiOjIwMCwiaWF0IjoxNTcxMDYxOTA5LCJleHAiOjE1NzEwNjM3MDl9.Y3NQsn8vS6CxTRoR7RSr6PBzc4rq-HyFOYA9KdlH19U`
        }
        axios
          .post("/auth/newAccountRequest", {
            email: this.state.email,
          }, {headers : headers})
          .then(res => {
            if (res.status === 200) {
              console.log(res.data);
              this.setState({ userCreated: true });
            }
          })
          .catch(err => {
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
      }
    });
  };

  handleForgot() {
    this.context.setUser(-2, "");
  }

  render() {
    const {
      email,
      emailError,
    } = this.state;
    return (
      <Segment placeholder>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column>
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
            {this.state.userCreated ? (
              <Message
                success
                header='User Created'
                content={`${this.state.submittedEmail} has received the email`}
              />
            ) : (
                null
              )}
          </Grid.Column>
          <Grid.Column verticalAlign="middle">
            <Button
              content="Upload .csv"
              secondary
              style={{ minWidth: "210px", margin: "1em auto" }}
            />
          </Grid.Column>
        </Grid>

        


      </Segment>

    );
  }
}

export default CreateAccountAdmin;
