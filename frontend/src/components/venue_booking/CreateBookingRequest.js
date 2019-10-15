import React from "react";
import SelectVenueCard from "./SelectVenueCard";
import VenueAvailabilityCard from "./VenueAvailabilityCard";
import BookVenueForm from "./BookVenueForm";
import { Card, Segment } from "semantic-ui-react";

class CreateBookingRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = { category: "", room: null };

    this.renderVenueAvailabilityCard = this.renderVenueAvailabilityCard.bind(
      this
    );
    this.renderBookingForm = this.renderBookingForm.bind(this);
    this.renderSuccessStatusBar = this.renderSuccessStatusBar.bind(this);
    this.renderErrorStatusBar = this.renderErrorStatusBar.bind(this);
  }

  renderVenueAvailabilityCard(category) {
    this.setState({ category, room: null, status: null });
    console.log("Selected category:", category);
  }

  renderBookingForm(room) {
    this.setState({ room });
    console.log("Selected room:", room);
  }

  renderSuccessStatusBar(message) {
    const status = {
      success: true,
      message: message
    };
    this.setState({ status });
    console.log("Success status:", status);
  }

  renderErrorStatusBar(message) {
    const status = {
      success: false,
      message: message
    };
    this.setState({ status });
    console.log("Error status:", status);
  }

  render() {
    return (
      <div>
        {this.state.status && (
          <Segment
            textAlign="center"
            inverted
            color={this.state.status.success ? "green" : "red"}
          >
            {this.state.status.message}
          </Segment>
        )}
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
            <BookVenueForm
              room={this.state.room}
              renderSuccessStatusBar={this.renderSuccessStatusBar}
              renderErrorStatusBar={this.renderErrorStatusBar}
            />
          ) : (
            <Card style={{ boxShadow: "none" }} />
          )}
        </div>
      </div>
    );
  }
}

export default CreateBookingRequest;
