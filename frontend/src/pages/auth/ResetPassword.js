import React from "react";
import ResetPasswordDivider from "../../components/auth/ResetPasswordDivider.js";
import { Grid } from "semantic-ui-react";

const ResetPasswordForm = () => (
  <Grid style={{ height: "100vh" }} textAlign="center" verticalAlign="middle">
    <Grid.Column style={{ maxWidth: "80%" }}>
      <ResetPasswordDivider />
    </Grid.Column>
  </Grid>
);

export default ResetPasswordForm;
