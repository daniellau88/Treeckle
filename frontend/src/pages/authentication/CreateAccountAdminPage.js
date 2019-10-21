import React from "react";
import CreateAccountAdmin from "../../components/CreateAccountAdmin";
import { Grid } from "semantic-ui-react";

const CreateAccountAdminPage = () => (
  <Grid style={{ height: "100vh" }} textAlign="center" verticalAlign="middle">
    <Grid.Column style={{ maxWidth: "80%" }}>
      <CreateAccountAdmin />
    </Grid.Column>
  </Grid>
);

export default CreateAccountAdminPage;
