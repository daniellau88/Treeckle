import React, { useState } from "react";
import CarousellCards from "../components/CarousellCards";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, Icon, Image, Header, Menu } from "semantic-ui-react";
import EventCard from "../components/EventCard";
import EventList from "../components/EventList";

const EventsPage = props => {
  return (
    <main className="events-page">
      <Menu size="huge"></Menu>
      <br />
      <div className="placeholder">

        <br /><br />
        <Header style={{ margin: "1em 1em" }}>Recommended Events</Header>
        <CarousellCards />
        <br /><br />
        <br /><br />

        <div style={{ margin: "auto 10vw" }}>
          <Header style={{ margin: "1em 1em" }}>Your Created Events</Header>
          <EventList />
          <br /><br />
          <br /><br />
        </div>
      </div>
    </main>
  );
};

export default EventsPage;
