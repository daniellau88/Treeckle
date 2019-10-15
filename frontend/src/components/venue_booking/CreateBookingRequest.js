import React from "react";
import SelectVenueCard from "./SelectVenueCard";
import VenueAvailabilityCard from "./VenueAvailabilityCard";
import BookVenueForm from "./BookVenueForm";
import { Card, Transition } from "semantic-ui-react";

class CreateBookingRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = { category: "", room: null };

    this.renderVenueAvailabilityCard = this.renderVenueAvailabilityCard.bind(
      this
    );
    this.renderBookingForm = this.renderBookingForm.bind(this);
  }

  renderVenueAvailabilityCard(category) {
    this.setState({ category, room: null });
    console.log("Selected category:", category);
  }

  renderBookingForm(room) {
    this.setState({ room });
    console.log("Selected room:", room);
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
        {this.state.category ? (
          <VenueAvailabilityCard
            category={this.state.category}
            renderBookingForm={this.renderBookingForm}
          />
        ) : (
          <Card style={{ boxShadow: "none" }} />
        )}
        {this.state.room ? (
          <BookVenueForm room={this.state.room} />
        ) : (
          <Card style={{ boxShadow: "none" }} />
        )}
      </div>
    );
  }
}

export default CreateBookingRequest;
