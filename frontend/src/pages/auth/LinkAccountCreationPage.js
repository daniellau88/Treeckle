import React from "react";
import AccountCreationForm from "../../components/auth/AccountCreationForm.js";
import AuthLayoutResetState from "../../components/auth/AuthLayoutResetState";

const LinkAccountCreationPage = props => (
  <AuthLayoutResetState
    form={
      <AccountCreationForm
        directCreation={false}
        uniqueId={props.match.params.uniqueId}
      />
    }
  />
);

export default LinkAccountCreationPage;
