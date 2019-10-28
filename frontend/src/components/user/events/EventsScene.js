import React from "react";
import CarousellCards from "../../CarousellCards";
import { Container } from "semantic-ui-react";
import EventList from "../..//EventList";

const EventsScene = props => {
  return (
    <div>
      <br />
      <CarousellCards />
      <br />
      <br />
      <br />
      <br />

      <br />
      <br />
      <Container>
        <h1 style={{ color: "#FDFDFD" }}>Upcoming Events</h1>
      </Container>
      <br />
      <CarousellCards />
      <br />
      <br />
      <br />
      <br />

      <br />
      <br />
      <Container>
        <h1 style={{ color: "#FDFDFD" }}>Signed Up Events</h1>
      </Container>
      <br />
      <CarousellCards />
      <br />
      <br />
      <br />
      <br />

      <br />
      <br />
      <Container>
        <h1 style={{ color: "#FDFDFD" }}>Your Created Events</h1>
        <EventList />
      </Container>

      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default EventsScene;
