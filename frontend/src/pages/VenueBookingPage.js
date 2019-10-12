import React from "react";
import SelectVenueCard from "../components/SelectVenueCard";
import VenueAvailabilityCard from "../components/VenueAvailabilityCard";
import BookVenueForm from "../components/BookVenueForm";
import { Container, Card } from "semantic-ui-react";

class VenueBookingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Container>
        <Card.Group centered>
          <SelectVenueCard />
          <VenueAvailabilityCard />
          <BookVenueForm />
        </Card.Group>
      </Container>
    );
  }
}

export default VenueBookingPage;
