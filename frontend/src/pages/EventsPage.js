import React, { useState } from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'
import EventCard from '../components/EventCard'

const EventsPage = (props) => {

  const [modal, setModal] = useState(false);

  const eventOne = { 
    title: 'Investment', 
    desc: "For investors paying for eac",
    date: 'Tues Night',
    location: 'Dining Hall',
    image: 'http://www.nusinvest.com/wp-content/uploads/2016/03/General-poster.jpg' 
  };

  return (
    <main className="events-page">
      <div className="placeholder">This is the events page.
        <EventCard event={eventOne} />
      </div>
    </main>
  );
};

export default EventsPage;
