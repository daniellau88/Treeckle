import React from "react";
import LoginDivider from "../../components/LoginDivider";
import { Grid } from "semantic-ui-react";

const CreateAccountUser = () => (
  <Grid style={{ height: "100vh" }} textAlign="center" verticalAlign="middle">
    <Grid.Column style={{ maxWidth: "70%" }}>
      <LoginDivider />
    </Grid.Column>
  </Grid>
);

export default CreateAccountUser;
