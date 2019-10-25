import React from "react";
import RegisterFromEmailDivider from "../../components/RegisterFromEmailDivider.js";
import { Grid } from "semantic-ui-react";

const RegisterFromEmailForm = () => (
  <Grid style={{ height: "100vh" }} textAlign="center" verticalAlign="middle">
    <Grid.Column style={{ maxWidth: "80%" }}>
      <RegisterFromEmailDivider />
    </Grid.Column>
  </Grid>
);

export default RegisterFromEmailForm;
