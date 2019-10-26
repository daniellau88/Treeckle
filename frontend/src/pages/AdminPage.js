import React from "react";
import ReactGA from "react-ga";
import { Context } from "../contexts/UserProvider";
import { Container, Menu } from "semantic-ui-react";
import AccountCreation from "../components/admin/account_creation/AccountCreation";
import UserAccountsTable from "../components/UserAccountsTable";
import BookingsTable from "../components/admin_venue_booking/BookingsTable";
import AdminConfig from "../components/AdminConfig";

class AdminPage extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    ReactGA.pageview("/admin");
  }

  render() {
    return (
      <main className="admin-page">
        <Menu size="huge"></Menu>
        <br />
        <br />
        <Container>
          <h1 style={{ color: "#FDFDFD" }}>Booking Requests</h1>
          <BookingsTable />
        </Container>
        <br />
        <br />
        <br />
        <Container>
          <h1 style={{ color: "#FDFDFD" }}>Account Creation</h1>
          <AccountCreation />
        </Container>
        <br />
        <br />
        <br />
        <Container>
          <h1 style={{ color: "#FDFDFD" }}>Admin Configuration</h1>
          <AdminConfig />
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

export default AdminPage;
