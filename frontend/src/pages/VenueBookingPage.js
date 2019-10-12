import React, { useState } from "react";
import SelectVenueCard from "../components/SelectVenueCard";
import VenueAvailabilityCard from "../components/VenueAvailabilityCard";
import BookVenueForm from "../components/BookVenueForm";
import { Container, Button, Icon, Card } from "semantic-ui-react";
import ExistingBookings from "../components/ExistingBookings";

const VenueBookingPage = props => {
  const [creating, setCreating] = useState(false);

  return (
    <Container>
      {!creating ? (
        <Button fluid animated="fade" onClick={() => setCreating(!creating)}>
          <Button.Content visible>
            <Icon name="add" />
          </Button.Content>
          <Button.Content hidden>Create new booking</Button.Content>
        </Button>
      ) : (
        <Button fluid animated="fade" onClick={() => setCreating(!creating)}>
          <Button.Content visible>
            <Icon name="close" />
          </Button.Content>
          <Button.Content hidden>Cancel booking creation</Button.Content>
        </Button>
      )}
      {!creating ? (
        <ExistingBookings />
      ) : (
        <Card.Group centered>
          <SelectVenueCard />
          <VenueAvailabilityCard />
          <BookVenueForm />
        </Card.Group>
      )}
    </Container>
  );
};

export default VenueBookingPage;
