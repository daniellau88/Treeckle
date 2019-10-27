import React from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { Context } from "../../contexts/UserProvider";

class AuthLayoutResetState extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.context.resetUser();
  }

  render() {
    return <AuthLayout form={this.props.form} />;
  }
}

export default AuthLayoutResetState;
