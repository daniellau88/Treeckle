import React from "react";
import ReactGA from "react-ga";
import { Context } from "../contexts/UserProvider";
import { Container, Menu } from "semantic-ui-react";
import CreateAccountAdmin from "../components/CreateAccountAdmin";
import ReviewUsers from "../components/ReviewUsers";
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
          <h1>Booking requests</h1>
          <BookingsTable />
        </Container>
        <br />
        <br />
        <br />
        <Container>
          <h1>Create accounts</h1>
          <CreateAccountAdmin />
        </Container>
        <br />
        <br />
        <br />
        <Container>
          <h1>Admin Configuration</h1>
          <AdminConfig />
        </Container>
        <br />
        <br />
        <br />
        <Container>
          <h1>Review accounts</h1>
          <ReviewUsers />
        </Container>
        <br />
        <br />
        <br />
      </main>
    );
  }
}

export default AdminPage;
