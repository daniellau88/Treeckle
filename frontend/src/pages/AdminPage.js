import React from "react";
import { Context } from "../contexts/UserProvider";
import { Container, Menu } from "semantic-ui-react";
import BookingsTable from "../components/admin_venue_booking/BookingsTable";

class AdminPage extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
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
        <Container>
          <h1>Booking requests</h1>
          <BookingsTable />
        </Container>
      </main>
    );
  }
}

export default AdminPage;
