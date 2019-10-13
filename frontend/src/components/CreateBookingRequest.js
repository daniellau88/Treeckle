import React from "react";
import SelectVenueCard from "./SelectVenueCard";
import VenueAvailabilityCard from "./VenueAvailabilityCard";
import BookVenueForm from "./BookVenueForm";
import { Card, Grid, Container } from "semantic-ui-react";

class CreateBookingRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1em",
          flexWrap: "wrap"
        }}
      >
        <SelectVenueCard />
        <VenueAvailabilityCard />
        <BookVenueForm />
      </div>
    );
  }
}

export default CreateBookingRequest;
