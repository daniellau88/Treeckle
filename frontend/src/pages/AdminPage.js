import React from "react";
import ReactGA from "react-ga";
import { Context } from "../contexts/UserProvider";
import { Container, Menu } from "semantic-ui-react";
import CreateAccountAdmin from "../components/CreateAccountAdmin";
import UserAccountsTable from "../components/UserAccountsTable";
import BookingsTable from "../components/admin_venue_booking/BookingsTable";
import AdminConfig from "../components/AdminConfig";

class AdminPage extends React.Component {
  static contextType = Context;
  constructor(props) {
    super(props);

    ReactGA.pageview("/admin");

    this.state = {
      allRequests: [],
      pendingRequests: [],
      approvedRequests: [],
      rejectedRequests: [],
      cancelledRequests: []
    };
  }

  render() {
    return (
      <main className="admin-page">
        <Menu size="huge"></Menu>
        <br />
        <br />
        <Container>
<<<<<<< Updated upstream
          <h1>Booking Requests</h1>
=======
          <h1 style={{ color: "#FDFDFD" }}>Booking requests</h1>
>>>>>>> Stashed changes
          <BookingsTable />
        </Container>
        <br />
        <br />
        <br />
        <Container>
<<<<<<< Updated upstream
          <h1>Create Accounts</h1>
=======
          <h1 style={{ color: "#FDFDFD" }}>Create accounts</h1>
>>>>>>> Stashed changes
          <CreateAccountAdmin />
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
<<<<<<< Updated upstream
          <h1>User Accounts</h1>
          <UserAccountsTable />
=======
          <h1 style={{ color: "#FDFDFD" }}>Review accounts</h1>
          <ReviewUsers />
>>>>>>> Stashed changes
        </Container>
        <br />
        <br />
        <br />
      </main>
    );
  }
}

export default AdminPage;
