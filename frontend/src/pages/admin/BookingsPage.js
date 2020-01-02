import React from "react";
import ReactGA from "react-ga";
import { Context } from "../../contexts/UserProvider";
import { Container, Menu, Button } from "semantic-ui-react";
import BookingsTable from "../../components/admin/venue_booking/BookingsTable";

class BookingsPage extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    ReactGA.pageview("/admin/bookings");
  }

  render() {
    return (
      <main className="admin-bookings-page">
        <Menu size="huge"></Menu>
        <br />
        <br />
        <Container>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1 style={{ color: "#FDFDFD" }}>Booking Requests</h1>
            <span>
              <Button>Manage</Button>
            </span>
          </div>
          <BookingsTable />
        </Container>
        <br />
        <br />
        <br />
      </main>
    );
  }
}

export default BookingsPage;
