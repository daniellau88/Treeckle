import React, { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Context } from "../../contexts/UserProvider";
import { Form, Header, Message } from "semantic-ui-react";
import { CONSOLE_LOGGING } from "../../DevelopmentView";
import { UNKNOWN_ERROR } from "../../util/Constants";

const MISSING_FIELDS = "Missing email/password.";
const INCORRECT_CREDENTIALS = "Incorrect email/password.";

const LoginForm = props => {
  const context = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidMessage, setInvalidMessage] = useState("");
  const history = useHistory();

  const handleSubmit = () => {
    axios
      .post("/auth/accounts", {
        email: email,
        password: password
      })
      .then(response => {
        CONSOLE_LOGGING && console.log("POST sign in:", response);
        if (response.status === 200) {
          const { token, name, profilePic, role } = response.data;
          context.setUser(token, name, profilePic.data, role);
          history.replace("/dashboard");
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING && console.log("POST sign in error:", response);
        let msg;
        switch (response.status) {
          case 400:
            msg = MISSING_FIELDS;
            break;
          case 401:
            msg = INCORRECT_CREDENTIALS;
            break;
          default:
            msg = UNKNOWN_ERROR;
        }
        setInvalidMessage(msg);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Header>Sign in</Header>
      <Form.Input
        icon="mail"
        iconPosition="left"
        placeholder="Email"
        onChange={(event, { value }) => {
          setEmail(value);
          setInvalidMessage("");
        }}
        type="email"
      />
      <Form.Input
        icon="lock"
        iconPosition="left"
        placeholder="Password"
        type="password"
        onChange={(event, { value }) => {
          setPassword(value);
          setInvalidMessage("");
        }}
      />
      {invalidMessage && (
        <Message
          error
          content={invalidMessage}
          style={{ display: "block", maxWidth: "210px", margin: "1em auto" }}
        />
      )}
      <div
        onClick={() => props.setForgetPassword(true)}
        style={{ marginBottom: "1em", color: "blue", cursor: "pointer" }}
      >
        <u>Forgot password?</u>
      </div>
      <Form.Button content="Login" primary fluid />
    </Form>
  );
};

export default LoginForm;
