import React from "react";
import { Button, Divider, Form, Grid, Segment, Image } from "semantic-ui-react";

const LoginDivider = () => (
  <Segment placeholder>
    <Grid columns={2} relaxed="very" stackable>
      <Grid.Column verticalAlign="middle">
        <Form>
          <Form.Input icon="user" iconPosition="left" placeholder="Email" />
          <Form.Input
            icon="lock"
            iconPosition="left"
            placeholder="Password"
            type="password"
          />
          <br />
          <Button content="Login" primary style={{ minWidth: "71.6%" }} />
        </Form>
      </Grid.Column>
      <Grid.Column verticalAlign="middle">
        <Image
          src="https://react.semantic-ui.com/images/wireframe/image.png"
          fluid
        />
      </Grid.Column>
    </Grid>

    {/* <Divider vertical></Divider> */}
  </Segment>
);

export default LoginDivider;
