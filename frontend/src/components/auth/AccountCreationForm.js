import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Form, Header, Message } from "semantic-ui-react";
import { CONSOLE_LOGGING } from "../../DevelopmentView";
import { UNKNOWN_ERROR } from "../../util/Constants";
import { Context } from "../../contexts/UserProvider";

const USER_EXISTS = "An account with this email already exists.";
const USER_EMAIL_ERROR =
  "Either an account with this email already exists or current email does not match with the email containing this link.";
const INVALID_FIELDS = "Invalid fields.";

const AccountCreationForm = props => {
  const context = useContext(Context);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invalidMessage, setInvalidMessage] = useState("");
  const [userCreated, setUserCreated] = useState(false);
  const history = useHistory();

  const areValidFields = () => {
    return (
      name && email && password.length >= 8 && password === confirmPassword
    );
  };

  const handleSubmitDirect = () => {
    const data = {
      name: name,
      email: email,
      password: password
    };
    CONSOLE_LOGGING && console.log("Submission data", data);
    axios
      .post("/auth/newAccountsDirect", data)
      .then(response => {
        CONSOLE_LOGGING && console.log("POST create account direct:", response);
        if (response.status === 200) {
          setUserCreated(true);
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING &&
          console.log("POST create account direct error:", response);
        let msg;
        switch (response.status) {
          case 400:
            msg = USER_EXISTS;
            break;
          case 422:
            msg = INVALID_FIELDS;
            break;
          default:
            msg = UNKNOWN_ERROR;
        }
        setInvalidMessage(msg);
      });
  };

  const handleSubmitLink = () => {
    const data = {
      name: name,
      email: email,
      password: password,
      uniqueURIcomponent: props.uniqueId
    };
    CONSOLE_LOGGING && console.log("Submission data", data);
    axios
      .post("/auth/newAccounts", data)
      .then(response => {
        CONSOLE_LOGGING && console.log("POST create account link:", response);
        if (response.status === 200) {
          setUserCreated(true);
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING &&
          console.log("POST create account link error:", response);
        let msg;
        switch (response.status) {
          case 400:
            msg = USER_EMAIL_ERROR;
            break;
          case 422:
            msg = INVALID_FIELDS;
            break;
          default:
            msg = UNKNOWN_ERROR;
        }
        setInvalidMessage(msg);
      });
  };

  return (
    <Form
      onSubmit={props.directCreation ? handleSubmitDirect : handleSubmitLink}
    >
      <Header>Create account</Header>
      <Form.Input
        icon="user"
        iconPosition="left"
        placeholder="Name"
        onChange={(event, { value }) => {
          setName(value);
          setInvalidMessage("");
        }}
        disabled={userCreated}
      />
      <Form.Input
        icon="mail"
        iconPosition="left"
        placeholder="Email"
        type="email"
        onChange={(event, { value }) => {
          setEmail(value);
          setInvalidMessage("");
        }}
        disabled={userCreated}
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
        disabled={userCreated}
      />
      <Form.Input
        icon="lock"
        iconPosition="left"
        placeholder="Confirm password"
        type="password"
        onChange={(event, { value }) => {
          setConfirmPassword(value);
          setInvalidMessage("");
        }}
        disabled={userCreated}
      />

      {!userCreated && password && password.length < 8 && (
        <div style={{ color: "red" }}>Password is less than 8 characters</div>
      )}

      {!userCreated &&
        password &&
        confirmPassword &&
        (password === confirmPassword ? (
          <div style={{ color: "green" }}>Passwords match</div>
        ) : (
          <div style={{ color: "red" }}>Passwords don't match</div>
        ))}

      {invalidMessage && (
        <Message
          error
          content={invalidMessage}
          style={{ display: "block", maxWidth: "210px", margin: "1em auto" }}
        />
      )}

      <Form.Button
        content={userCreated ? "User Created" : "Create"}
        primary={!userCreated}
        secondary={userCreated}
        fluid
        disabled={!areValidFields() || userCreated}
        type="submit"
        style={{ marginTop: "1em" }}
      />
      {userCreated && (
        <Form.Button
          fluid
          content="Login here"
          onClick={() => {
            context.resetUser();
            history.push("/");
          }}
          primary
          type="button"
        />
      )}
    </Form>
  );
};

export default AccountCreationForm;
