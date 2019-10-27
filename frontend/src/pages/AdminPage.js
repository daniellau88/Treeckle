import React from "react";
import ReactGA from "react-ga";
import { Context } from "../contexts/UserProvider";
import { Container, Menu, Grid } from "semantic-ui-react";
import AccountCreation from "../components/admin/account_creation/AccountCreation";
import UserAccountsTable from "../components/admin/user_accounts/UserAccountsTable";
import BookingsTable from "../components/admin/venue_booking/BookingsTable";
import AdminConfig from "../components/admin/config/AdminConfig";

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
          <Grid columns={2} stackable>
            <Grid.Column>
              <h1 style={{ color: "#FDFDFD", alignSelf: "left" }}>
                Create Accounts
              </h1>
              <AccountCreation />
            </Grid.Column>
            <Grid.Column>
              <h1 style={{ color: "#FDFDFD" }}>Admin Configuration</h1>
              <AdminConfig />
            </Grid.Column>
          </Grid>
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
