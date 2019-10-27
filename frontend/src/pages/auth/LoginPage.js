import React, { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";
import ForgetPasswordForm from "../../components/auth/ForgotPasswordForm";

const LoginPage = props => {
  const [forgetPassword, setForgetPassword] = useState(false);

  return (
    <AuthLayout
      children={
        forgetPassword ? (
          <ForgetPasswordForm setForgetPassword={setForgetPassword} />
        ) : (
          <LoginForm setForgetPassword={setForgetPassword} />
        )
      }
    />
  );
};

export default LoginPage;
