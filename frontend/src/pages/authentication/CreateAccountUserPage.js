import React from "react";
import CreateAccountUser from "../../components/CreateAccountUser";
import { Grid } from "semantic-ui-react";

const CreateAccountUserPage = () => (
  <Grid style={{ height: "100vh" }} textAlign="center" verticalAlign="middle">
    <Grid.Column style={{ maxWidth: "70%" }}>
      <CreateAccountUser />
    </Grid.Column>
  </Grid>
);

export default CreateAccountUserPage;
