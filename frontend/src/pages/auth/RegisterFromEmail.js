import React, { useEffect, useContext } from "react";
import RegisterFromEmailDivider from "../../components/auth/RegisterFromEmailDivider.js";
import { Grid } from "semantic-ui-react";
import { Context } from "../../contexts/UserProvider";

const RegisterFromEmailForm = () => {
  const context = useContext(Context);

  useEffect(() => {
    context.resetUser();
  });

  return (
    <Grid style={{ height: "100vh" }} textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: "80%" }}>
        <RegisterFromEmailDivider />
      </Grid.Column>
    </Grid>
  );
};

export default RegisterFromEmailForm;
