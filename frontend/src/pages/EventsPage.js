import React, { useState } from "react";
import UpcomingCarousellCards from "../components/UpcomingCarousellCards";
import RecommendedCarousellCards from "../components/RecommendedCarousellCards";
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
        <Header style={{ margin: "1em 1em" }}>Upcoming Events</Header>
        <UpcomingCarousellCards />
        <br /><br />
        <br /><br />

        <br /><br />
        <Header style={{ margin: "1em 1em" }}>Recommended Events</Header>
        <RecommendedCarousellCards />
        <br /><br />
        <br /><br />
        
      </div>
    </main>
  );
};

export default EventsPage;
