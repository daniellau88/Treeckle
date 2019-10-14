import React, { useContext, useState } from "react";
import logo from "../images/treeckle_startup.png";
import axios from 'axios';
import {
  Button,
  Divider,
  Form,
  Grid,
  Segment,
  Image,
  Header
} from "semantic-ui-react";
import UserContext from '../context/UserContext'

const LoginDivider = () => {

  const { user, setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const temp = {
    name: "admin@admin.com",
    password: "nothunter2"
  };

  const login = async () => {
    console.log(email, password);
    const res = await axios.post(`https://private-anon-8805d495b4-treeckle.apiary-mock.com/auth/accounts`, { temp });
    setUser(res.data);
  }

  return (
    <Segment placeholder>
      <Grid columns={2} relaxed="very" stackable>
        <Grid.Column verticalAlign="middle">
          <Header style={{ margin: "1.5em auto" }}>Sign in</Header>
          <Form>
            <Form.Input icon="user" 
            iconPosition="left" 
            placeholder="Email" 
            onChange={event => setEmail(event.target.value)}
            />
            <Form.Input
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onChange={event => setPassword(event.target.value)}
            />
            <div style={{ margin: "1em auto" }}>
              <a href={""}>Forgot password?</a>
            </div>
            <Button
              content="Login"
              primary
              style={{ minWidth: "210px", margin: "1em auto" }}
              onClick={login}
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

export default LoginDivider;
