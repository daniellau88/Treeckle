import React from "react";
import {
  Button,
  Divider,
  Form,
  Grid,
  Segment,
  Image,
  Header
} from "semantic-ui-react";

const LoginDivider = () => (
  <Segment placeholder>
    <Grid columns={2} relaxed="very" stackable>
      <Grid.Column verticalAlign="middle">
        <Header style={{ margin: "1.5em auto" }}>Sign in</Header>
        <Form>
          <Form.Input icon="user" iconPosition="left" placeholder="Email" />
          <Form.Input
            icon="lock"
            iconPosition="left"
            placeholder="Password"
            type="password"
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
