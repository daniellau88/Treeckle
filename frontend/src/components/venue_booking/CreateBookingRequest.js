import React from "react";
import SelectVenueCard from "./SelectVenueCard";
import VenueAvailabilityCard from "./VenueAvailabilityCard";
import BookVenueForm from "./BookVenueForm";
import StatusBar from "./StatusBar";
import { Card } from "semantic-ui-react";

class CreateBookingRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      venue: null, //{roomId: string, name: string}
      bookingPeriod: null, // {venue, start: date in ms, end: date in ms}
      status: null, // {success: boolean, message: string}
      submitting: false // indicates if the submission is still processing
    };

    this.renderVenueAvailabilityCard = this.renderVenueAvailabilityCard.bind(
      this
    );
    this.renderBookingForm = this.renderBookingForm.bind(this);
    this.toggleStatusBar = this.toggleStatusBar.bind(this);
    this.renderStatusBar = this.renderStatusBar.bind(this);
  }

  renderVenueAvailabilityCard(venue) {
    this.setState({ venue, bookingPeriod: null, status: null });
    console.log("Selected venue:", venue);
  }

  renderBookingForm(bookingPeriod) {
    this.setState({ bookingPeriod });
    console.log("Selected booking period:", bookingPeriod);
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
            status={this.state.status}
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
          {this.state.venue ? (
            <VenueAvailabilityCard
              venue={this.state.venue}
              renderBookingForm={this.renderBookingForm}
            />
          ) : (
            <Card style={{ boxShadow: "none", backgroundColor: "#ffd477" }} />
          )}
          {this.state.bookingPeriod ? (
            <BookVenueForm
              bookingPeriod={this.state.bookingPeriod}
              renderStatusBar={this.renderStatusBar}
              toggleStatusBar={this.toggleStatusBar}
            />
          ) : (
            <Card style={{ boxShadow: "none", backgroundColor: "#ffd477" }} />
          )}
        </div>
      </div>
    );
  }
}

export default CreateBookingRequest;
