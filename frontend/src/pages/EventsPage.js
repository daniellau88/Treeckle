import React, { useState } from "react";
import CarousellCards from "../components/CarousellCards";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, Icon, Image, Header } from "semantic-ui-react";
import EventCard from "../components/EventCard";
import EventList from "../components/EventList";

const EventsPage = props => {
  return (
    <main className="events-page">
      <div className="placeholder">
        <Header style={{ margin: "1em 1em" }}>Recommended Events</Header>
        <CarousellCards />
        <Header style={{ margin: "1em 1em" }}>Your Created Events</Header>
        <div style={{ margin: "auto 10vw" }}>
          <EventList />
        </div>
      </div>
    </main>
  );
};

export default EventsPage;
