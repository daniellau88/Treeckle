import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Form, Header, Message } from "semantic-ui-react";
import { CONSOLE_LOGGING } from "../../DevelopmentView";
import { UNKNOWN_ERROR } from "../../util/Constants";
import { Context } from "../../contexts/UserProvider";

const INVALID_FIELDS = "Invalid fields.";

const ResetPasswordForm = props => {
  const context = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invalidMessage, setInvalidMessage] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const history = useHistory();

  const areValidFields = () => {
    return email && password.length >= 8 && password === confirmPassword;
  };

  const handleSubmit = () => {
    const data = {
      email: email,
      password: password,
      uniqueURIcomponent: props.uniqueId
    };
    CONSOLE_LOGGING && console.log("Submission data", data);
    axios
      .post("/auth/resetAttempt", data)
      .then(response => {
        CONSOLE_LOGGING && console.log("POST reset account:", response);
        if (response.status === 200) {
          setPasswordChanged(true);
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING && console.log("POST reset account error:", response);
        let msg;
        switch (response.status) {
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
    <Form onSubmit={handleSubmit}>
      <Header>Reset password</Header>
      <div style={{ margin: "0 auto 1em", maxWidth: "210px" }}>
        Please provide us with your email and new password.
      </div>
      <Form.Input
        icon="mail"
        iconPosition="left"
        placeholder="Email"
        type="email"
        onChange={(event, { value }) => {
          setEmail(value);
          setInvalidMessage("");
        }}
        disabled={passwordChanged}
      />
      <Form.Input
        icon="lock"
        iconPosition="left"
        placeholder="New password"
        type="password"
        onChange={(event, { value }) => {
          setPassword(value);
          setInvalidMessage("");
        }}
        disabled={passwordChanged}
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
        disabled={passwordChanged}
      />

      {!passwordChanged && password && password.length < 8 && (
        <div style={{ color: "red" }}>Password is less than 8 characters</div>
      )}

      {!passwordChanged &&
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
        content={passwordChanged ? "Password changed" : "Reset"}
        primary={!passwordChanged}
        secondary={passwordChanged}
        fluid
        disabled={!areValidFields() || passwordChanged}
        type="submit"
        style={{ marginTop: "1em" }}
      />
      {passwordChanged && (
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

export default ResetPasswordForm;
