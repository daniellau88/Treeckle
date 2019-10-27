import React, { useEffect, useContext } from "react";
import ResetPasswordDivider from "../../components/auth/ResetPasswordDivider.js";
import { Grid } from "semantic-ui-react";
import { Context } from "../../contexts/UserProvider";

const ResetPasswordForm = () => {
  const context = useContext(Context);

  useEffect(() => {
    context.resetUser();
  });

  return (
    <Grid style={{ height: "100vh" }} textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: "80%" }}>
        <ResetPasswordDivider />
      </Grid.Column>
    </Grid>
  );
};

export default ResetPasswordForm;
