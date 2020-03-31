import React from "react";
import ReactGA from "react-ga";
import { Context } from "../../contexts/UserProvider";
import { Container, Menu } from "semantic-ui-react";
import AccountCreation from "../../components/admin/account_creation/AccountCreation";
import UserAccountsTable from "../../components/admin/user_accounts/UserAccountsTable";

class UsersPage extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    ReactGA.pageview("/admin/users");
  }

  render() {
    return (
      <main className="admin-users-page">
        <Menu size="huge" style={{ opacity: 0 }}></Menu>
        <br />
        <br />
        <Container>
          <h1 style={{ color: "#FDFDFD" }}>Create New Accounts</h1>
          <AccountCreation />
        </Container>
        <br />
        <br />
        <br />
        <Container>
          <h1 style={{ color: "#FDFDFD" }}>User Accounts</h1>
          <UserAccountsTable />
        </Container>
        <br />
        <br />
        <br />
      </main>
    );
  }
}

export default UsersPage;
