import React from "react";
import logo from "../images/treeckle_startup.png";
import { Context } from "../contexts/UserProvider";
import axios from "axios";
import * as yup from "yup";
import {
  Button,
  Divider,
  Form,
  Grid,
  Segment,
  Image,
  Header
} from "semantic-ui-react";

class ForgotPasswordDivider extends React.Component {
  static contextType = Context;

  state = {
    email: "",
    submittedEmail: "",
    emailError: null
  };

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
    const { email, password } = this.state;
    this.setState({
      submittedEmail: email,
      emailError: null
    });
    console.log(this.state.email);
    let inputData = { email: this.state.email };
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    this.EmailSchema.isValid(inputData).then(valid => {
      if (valid) {
        axios
          .post("/auth/resetAccount", inputData, config)
          .then(res => {
            if (res.status === 200) {
              alert(
                "An email to reset your password has been sent to your account."
              );
              this.props.history.push("/");
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.setState({
          emailError: { content: "Please enter a valid email." }
        });
      }
    });
  };

  render() {
    return (
      <Segment placeholder>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column verticalAlign="middle">
            <Header style={{ margin: "1.5em auto" }}>Reset Password</Header>
            <p
              style={{
                maxWidth: "210px",
                margin: "0 auto 1.5em auto",
                display: "inline-flex"
              }}
            >
              Please key in your email so that we can send you a link to reset
              your password.
            </p>
            <Form onSubmit={this.handleSubmit}>
              <Form.Input
                icon="user"
                iconPosition="left"
                placeholder="Email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
              />
              <Button
                content="Submit"
                primary
                style={{ minWidth: "210px", margin: "1em auto" }}
              />
            </Form>
          </Grid.Column>
          <Grid.Column verticalAlign="middle">
            <Image
              src={logo}
              onClick={() => this.context.setUser("", "", "")}
              style={{ cursor: "pointer" }}
              fluid
            />
          </Grid.Column>
        </Grid>

        {/* <Divider vertical></Divider> */}
      </Segment>
    );
  }
}

export default ForgotPasswordDivider;
