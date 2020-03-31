import React from "react";
import { useContext, useState } from "react";
import { Context } from "../../../contexts/UserProvider";
import axios from "axios";
import { Input, Header, Grid, Icon } from "semantic-ui-react";
import { CONSOLE_LOGGING } from "../../../DevelopmentView";

export default function UserSelfNameChanger() {
  const context = useContext(Context);

  const [state, setstate] = useState({
    editMode: false,
    editValue: context.name
  });

  const handleChange = e => {
    setstate({
      editMode: state.editMode,
      editValue: e.target.value
    });
  };

  const handleEditActivate = () => {
    setstate({
      editMode: !state.editMode,
      editValue: state.editValue
    });
  };

  const handleNameEdit = () => {
    axios
      .patch(
        "api/accounts/profileName",
        { newName: state.editValue },
        {
          headers: { Authorization: `Bearer ${context.token}` }
        }
      )
      .then(response => {
        CONSOLE_LOGGING && console.log("PATCH Name:", response);
        if (response.status === 200) {
          context.setUser(
            context.token,
            response.data,
            context.profilePic,
            context.role
          );
          setstate({
            editMode: false,
            editValue: response.data
          });
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
    <Grid columns={2}>
      <Grid.Column width={14}>
        {state.editMode ? (
          <Input
            style={{ minWidth: "50%", maxWidth: "80%" }}
            action={{
              color: "green",
              icon: "check",
              onClick: () => handleNameEdit()
            }}
            placeholder="Name cannot be empty"
            onChange={handleChange}
            value={state.editValue}
            defaultValue={context.name}
          />
        ) : (
          <p
            style={{
              fontSize: "1.75em",
              fontWeight: "bold",
              wordWrap: "break-word"
            }}
          >
            {context.name}
          </p>
        )}
      </Grid.Column>
      <Grid.Column width={2}>
        <Icon
          name="edit"
          onClick={handleEditActivate}
          style={{
            marginTop: "0.5rem",
            top: "50%",
            cursor: "pointer"
          }}
        />
      </Grid.Column>
    </Grid>
  );
}
