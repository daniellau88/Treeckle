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

class LoginDivider extends React.Component {
  static contextType = Context;
  state = {
    email: "",
    password: "",
    submittedEmail: "",
    submittedPassword: ""
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

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = () => {
    const { email, password } = this.state;
    this.setState({ submittedEmail: email, submittedPassword: password });
    console.log(this.state.email, this.state.password);
    let inputData = { email: this.state.email, password: this.state.password };
    this.InputSchema.isValid(inputData).then(valid => {
      if (valid) {
        console.log("yell hea!");
      }
    });
  };

  handleForgot() {
    this.context.setUser(-2, "");
  }

  render() {
    const { email, password, submittedEmail, submittedPassword } = this.state;
    return (
      <Segment placeholder>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column verticalAlign="middle">
            <Header style={{ margin: "1.5em auto" }}>Sign in</Header>
            <Form onSubmit={this.handleSubmit}>
              <Form.Input
                icon="user"
                iconPosition="left"
                placeholder="Email"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
              <Form.Input
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
              <div style={{ margin: "1em auto" }}>
                <a href={""}>Forgot password?</a>
              </div>
              <Button
                content="Login"
                primary
                style={{ minWidth: "210px", margin: "1em auto" }}
              />
            </Form>
          </Grid.Column>
          <Grid.Column verticalAlign="middle">
            <Image src={logo} fluid />
          </Grid.Column>
        </Grid>

        {/* <Divider vertical></Divider> */}
      </Segment>
    );
  }
}

export default LoginDivider;
