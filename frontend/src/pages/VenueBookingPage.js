import React, { useState } from "react";
import ReactGA from "react-ga";
import CreateBookingRequest from "../components/user/venue_booking/make_booking/CreateBookingRequest";
import { Container, Button, Icon, Menu } from "semantic-ui-react";
import UserBookingsTable from "../components/user/venue_booking/view_bookings/UserBookingsTable";

const VenueBookingPage = props => {
  ReactGA.pageview("/bookings");
  const [creating, setCreating] = useState(false);

  return (
    <main className="booking-page">
      <Menu size="huge" style={{ opacity: 0 }}></Menu>
      <br />
      <br />
      <Container>
        <Button fluid animated="fade" onClick={() => setCreating(!creating)}>
          <Button.Content visible>
            <Icon name={creating ? "close" : "add"} />
          </Button.Content>
          <Button.Content hidden>
            {creating ? "Cancel booking creation" : "Create new booking"}
          </Button.Content>
        </Button>
        {!creating && <h1 style={{ color: "#FDFDFD" }}>My Bookings</h1>}
        {!creating ? <UserBookingsTable /> : <CreateBookingRequest />}
      </Container>
      <br />
      <br />
      <br />
    </main>
  );
};

export default VenueBookingPage;
