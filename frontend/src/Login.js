import React from "react";
import LoginDivider from "./components/LoginDivider";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment
} from "semantic-ui-react";

const LoginForm = () => (
  <Grid style={{ height: "100vh" }} textAlign="center" verticalAlign="middle">
    <Grid.Column style={{ maxWidth: "70%" }}>
      <LoginDivider />
    </Grid.Column>
  </Grid>
);

export default LoginForm;
