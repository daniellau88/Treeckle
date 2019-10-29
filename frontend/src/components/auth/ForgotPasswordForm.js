import React, { useState } from "react";
import axios from "axios";
import { Message, Form, Header } from "semantic-ui-react";
import { CONSOLE_LOGGING } from "../../DevelopmentView";
import { UNKNOWN_ERROR } from "../../util/Constants";

const SUCCESS_MESSAGE =
  "An email to reset your password has been sent to your account.";
const INVALID_EMAIL = "Incorrect email.";

const ForgotPasswordForm = props => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = () => {
    axios
      .post("/auth/resetAccount", {
        email: email
      })
      .then(response => {
        CONSOLE_LOGGING && console.log("POST reset password:", response);
        if (response.status === 200) {
          setStatus({ success: true, message: SUCCESS_MESSAGE });
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING && console.log("POST reset password:", response);
        let msg;
        switch (response.status) {
          case 422:
            msg = INVALID_EMAIL;
            break;
          default:
            msg = UNKNOWN_ERROR;
        }
        setStatus({ success: false, message: msg });
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Header>Reset password</Header>
      <div style={{ margin: "0 auto 1em", maxWidth: "210px" }}>
        Please key in your email so that we can send you a link to reset your
        password.
      </div>
      <Form.Input
        icon="mail"
        iconPosition="left"
        placeholder="Email"
        name="email"
        onChange={(event, { value }) => {
          setEmail(value);
          setStatus(null);
        }}
        type="email"
      />

      {status !== null && (
        <Message
          error={!status.success}
          success={status.success}
          content={status.message}
          style={{ display: "block", maxWidth: "210px", margin: "1em auto" }}
        />
      )}
      <Form.Button content="Submit" primary fluid type="submit" />
      <Form.Button
        secondary
        fluid
        content="Back"
        onClick={() => props.setForgetPassword(false)}
        type="button"
      />
    </Form>
  );
};

export default ForgotPasswordForm;
