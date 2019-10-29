import React from "react";
import axios from "axios";
import { Card, Form, Button, Confirm } from "semantic-ui-react";
import { Context } from "../../../../contexts/UserProvider";
import "../../../../styles/BookVenueForm.scss";
import { CONSOLE_LOGGING } from "../../../../DevelopmentView";

const SUCCESS_MSG = "Your booking request has been successfully made.";
const OVERLAP_CONFLICT_MSG =
  "Your requested booking period is unavailable. Please amend your booking period.";
const UNKNOWN_ERROR_MSG = "An unknown error has occurred. Please try again.";
const TR2_LABEL = "Name and house of TR2-trained personnel";

class BookVenueForm extends React.Component {
  static contextType = Context;
  constructor(props) {
    super(props);

    this.state = this.getInitialState();

    this.onChange = this.onChange.bind(this);
    this.onSubmitting = this.onSubmitting.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.toggleConfirmation = this.toggleConfirmation.bind(this);
  }

  getInitialState() {
    const initialState = {
      confirming: false,
      contactNumber: 0,
      numParticipants: 0,
      purpose: "",
      tr2Trained: "",
      success: false
    };
    return initialState;
  }

  // called when user leaves the page or when a booking is successfully made.
  resetState() {
    this.setState(this.getInitialState());
  }

  // all fields cannot be empty
  areValidFields() {
    return (
      this.props.bookingPeriod &&
      this.state.purpose &&
      this.state.contactNumber > 0 &&
      this.state.numParticipants > 0
    );
  }

  onChange(event, { name, value }) {
    CONSOLE_LOGGING && console.log(`${name} changed:`, value);
    this.setState({ [name]: value });
  }

  async onSubmitting() {
    this.toggleConfirmation();
    this.props.toggleStatusBar(true);
  }

  handleOnSubmit() {
    this.onSubmitting()
      .then(() => {
        const data = {
          roomId: this.props.bookingPeriod.venue.roomId,
          description:
            (this.isTr2()
              ? `TR2-trained personnel: ${this.state.tr2Trained}\n\n`
              : "") + this.state.purpose,
          contactNumber: this.state.contactNumber,
          expectedAttendees: this.state.numParticipants,
          start: this.props.bookingPeriod.start,
          end: this.props.bookingPeriod.end
        };
        axios
          .post("api/rooms/bookings", data, {
            headers: { Authorization: `Bearer ${this.context.token}` }
          })
          .then(response => {
            CONSOLE_LOGGING && console.log("POST form submission:", response);
            if (response.status === 200) {
              this.setState({ success: true });
              this.props.renderStatusBar(true, SUCCESS_MSG);
            }
          })
          .catch(({ response }) => {
            CONSOLE_LOGGING &&
              console.log("POST form submission error:", response);
            let msg;
            switch (response.status) {
              case 400:
                msg = OVERLAP_CONFLICT_MSG;
                break;
              case 401:
                alert("Your current session has expired. Please log in again.");
                this.context.resetUser();
                break;
              default:
                msg = UNKNOWN_ERROR_MSG;
            }
            this.props.renderStatusBar(false, msg);
          });
      })
      .then(() => {
        this.props.toggleStatusBar(false);
      });
  }

  toggleConfirmation() {
    this.setState({ confirming: !this.state.confirming });
  }

  isTr2() {
    return this.props.bookingPeriod.venue.name === "Theme Room 2";
  }

  render() {
    return (
      <Card raised style={{ margin: "0 0 1em 0" }}>
        <Card.Content style={{ flexGrow: 0 }}>
          <Card.Header textAlign="center">
            Book {this.props.bookingPeriod.venue.name}
          </Card.Header>
        </Card.Content>
        <Card.Content style={{ flexGrow: 0 }}>
          <Form>
            <Form.Input
              label="Contact number"
              icon="phone"
              type="number"
              iconPosition="left"
              onChange={this.onChange}
              required
              name="contactNumber"
            />
            <Form.Input
              label="Expected number of attendees/participants"
              icon="users"
              type="number"
              iconPosition="left"
              onChange={this.onChange}
              required
              name="numParticipants"
            />
            {this.isTr2() && (
              <Form.Input
                label={TR2_LABEL}
                icon="user"
                iconPosition="left"
                onChange={this.onChange}
                required
                name="tr2Trained"
              />
            )}
            <Form.TextArea
              rows={8}
              label="Booking purpose"
              placeholder="Briefly describe the purpose for this booking..."
              onChange={this.onChange}
              disabled={this.state.success}
              required
              name="purpose"
            />
          </Form>
        </Card.Content>
        <Card.Content style={{ flexGrow: 0 }}>
          <Button
            primary
            fluid
            disabled={!this.areValidFields() || this.state.success}
            onClick={this.toggleConfirmation}
          >
            Submit
          </Button>
          <Confirm
            open={this.state.confirming}
            onCancel={this.toggleConfirmation}
            onConfirm={this.handleOnSubmit}
            content="Confirm booking?"
            size="mini"
          />
        </Card.Content>
      </Card>
    );
  }
}

export default BookVenueForm;
