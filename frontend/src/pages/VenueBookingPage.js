import React from "react";
import SelectVenueCard from "../components/SelectVenueCard";
import { Container } from "semantic-ui-react";

class VenueBookingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Container>
        <SelectVenueCard />
      </Container>
    );
  }
}

export default VenueBookingPage;
