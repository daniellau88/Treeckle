import React from "react";
import SelectVenueCard from "./SelectVenueCard";
import VenueAvailabilityCard from "./VenueAvailabilityCard";
import BookVenueForm from "./BookVenueForm";

class CreateBookingRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = { category: "" };

    this.renderVenueAvailabilityCard = this.renderVenueAvailabilityCard.bind(
      this
    );
  }

  renderVenueAvailabilityCard(category) {
    this.setState({ category });
    console.log("Selected category:", category);
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
        {this.state.category && (
          <VenueAvailabilityCard category={this.state.category} />
        )}
        <BookVenueForm />
      </div>
    );
  }
}

export default CreateBookingRequest;
