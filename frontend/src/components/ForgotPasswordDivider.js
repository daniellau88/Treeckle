import React from "react";
import logo from "../images/treeckle_startup.png";
import {
  Button,
  Divider,
  Form,
  Grid,
  Segment,
  Image,
  Header
} from "semantic-ui-react";

const ForgotPasswordDivider = () => (
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
          Please key in your email so that we can send you a link to reset your
          password.
        </p>
        <Form>
          <Form.Input icon="user" iconPosition="left" placeholder="Email" />
          <Button
            content="Submit"
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

export default ForgotPasswordDivider;
