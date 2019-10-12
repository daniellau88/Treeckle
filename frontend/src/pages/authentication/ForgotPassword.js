import React from "react";
import ForgotPasswordDivider from "../../components/ForgotPasswordDivider.js";
import { Grid } from "semantic-ui-react";

const ForgotPasswordForm = () => (
  <Grid style={{ height: "100vh" }} textAlign="center" verticalAlign="middle">
    <Grid.Column style={{ maxWidth: "70%" }}>
      <ForgotPasswordDivider />
    </Grid.Column>
  </Grid>
);

export default ForgotPasswordForm;
