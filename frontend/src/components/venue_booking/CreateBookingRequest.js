import React from "react";
import SelectVenueCard from "./SelectVenueCard";
import VenueAvailabilityCard from "./VenueAvailabilityCard";
import BookVenueForm from "./BookVenueForm";
import StatusBar from "./StatusBar";
import { Card } from "semantic-ui-react";

class CreateBookingRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = { category: "", room: null, status: null, submitting: false };

    this.renderVenueAvailabilityCard = this.renderVenueAvailabilityCard.bind(
      this
    );
    this.renderBookingForm = this.renderBookingForm.bind(this);
    this.loadStatusBar = this.loadStatusBar.bind(this);
    this.renderStatusBar = this.renderStatusBar.bind(this);
  }

  renderVenueAvailabilityCard(category) {
    this.setState({ category, room: null, status: null });
    console.log("Selected category:", category);
  }

  renderBookingForm(room) {
    this.setState({ room });
    console.log("Selected room:", room);
  }

  toggleStatusBar(submitting) {
    this.setState({ submitting });
  }

  renderStatusBar(success, message) {
    const status = {
      success: success,
      message: message
    };
    this.setState({ status });
    console.log("Status:", status);
  }

  render() {
    return (
      <div>
        {(this.state.status || this.state.submitting) && (
          <StatusBar
            status={this.status.status}
            submitting={this.state.submitting}
          />
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
              renderStatusBar={this.renderStatusBar}
              loadStatusBar={this.loadStatusBar}
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
