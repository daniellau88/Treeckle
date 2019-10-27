import React, { useEffect, useContext } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { Context } from "../../contexts/UserProvider";

const AuthLayoutResetState = props => {
  const context = useContext(Context);

  useEffect(() => {
    context.setUser(null, null, null, null);
  });

  return <AuthLayout form={props.form} />;
};

export default AuthLayoutResetState;
