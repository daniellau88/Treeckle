import React from "react";
import BookingForm from "../components/BookingForm";

class RoomsBookingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="rooms-booking-page">
        <BookingForm header="Select a facility" />
      </div>
    );
  }
}

export default RoomsBookingPage;
