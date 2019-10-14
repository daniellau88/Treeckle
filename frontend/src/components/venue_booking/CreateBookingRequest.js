import React from "react";
import SelectVenueCard from "./SelectVenueCard";
import VenueAvailabilityCard from "./VenueAvailabilityCard";
import BookVenueForm from "./BookVenueForm";

class CreateBookingRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = { venue: "" };

    this.renderVenueAvailabilityCard = this.renderVenueAvailabilityCard.bind(
      this
    );
  }

  renderVenueAvailabilityCard(venue) {
    this.setState({ venue });
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
        <SelectVenueCard
          renderVenueAvailabilityCard={this.renderVenueAvailabilityCard}
        />
        {this.state.venue && <VenueAvailabilityCard venue={this.state.venue} />}
        <BookVenueForm />
      </div>
    );
  }
}

export default CreateBookingRequest;
