import React from "react";
import { useContext, useState } from "react";
import { Context } from "../../../contexts/UserProvider";
import axios from "axios";
import { Input, Icon } from "semantic-ui-react";
import { CONSOLE_LOGGING } from "../../../DevelopmentView";

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function UserEmailChanger(props) {
  const context = useContext(Context);

  const [isEditing, setEditing] = useState(false);
  const [newEmail, setNewEmail] = useState(props.email);

  const isValidEmail = email => {
    return EMAIL_REGEX.test(email);
  };

  const handleChange = e => {
    setNewEmail(e.target.value);
  };

  const handleEmailEdit = () => {
    const data = { currentEmail: props.email, newEmail: newEmail };
    axios
      .patch("../api/accounts/userEmail", data, {
        headers: { Authorization: `Bearer ${context.token}` }
      })
      .then(response => {
        CONSOLE_LOGGING && console.log("PATCH update email:", response);
        if (response.status === 200) {
          props.updateTable();
          setEditing(false);
        }
      })
      .catch(error => {
        console.log(error);
        if (error.response) {
          if (error.response.status === 401) {
            alert("Your current session has expired. Please log in again.");
            context.resetUser();
          }
        }
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline"
      }}
    >
      {isEditing ? (
        <Input
          action={{
            positive: true,
            icon: "check",
            onClick: handleEmailEdit,
            disabled: !isValidEmail(newEmail)
          }}
          placeholder="Email cannot be empty"
          onChange={handleChange}
          value={newEmail}
          type="email"
          onKeyPress={e => {
            return e.key == "Enter" && isValidEmail(newEmail)
              ? handleEmailEdit()
              : null;
          }}
        />
      ) : (
        <div>{props.email}</div>
      )}
      <Icon
        name="edit"
        onClick={() => {
          setEditing(!isEditing);
          setNewEmail(props.email);
        }}
        link
      />
    </div>
  );
}

export default UserEmailChanger;
