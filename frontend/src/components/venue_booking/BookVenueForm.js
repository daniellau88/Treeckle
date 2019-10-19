import React from "react";
import Axios from "axios";
import { Card, Form, Button, Confirm } from "semantic-ui-react";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import { Context } from "../../contexts/UserProvider";
import { parseDateTime } from "../../util/DateUtil";

const SUCCESS_MSG = "Booking request has been successfully made.";
const OVERLAP_CONFLICT_MSG = "The requested booking period is unavailable.";
const UNAUTHORIZED_MSG =
  "Unauthorized. Current session may have already expired.";
const UNKNOWN_ERROR_MSG =
  "An unknown error has occurred. Please visit subbash.com to resolve the issue.";

class BookVenueForm extends React.Component {
  static contextType = Context;
  constructor(props) {
    super(props);

    this.state = this.getInitialState();

    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.onStartTimeChange = this.onStartTimeChange.bind(this);
    this.onEndTimeChange = this.onEndTimeChange.bind(this);
    this.onPurposeChange = this.onPurposeChange.bind(this);
    this.onSubmitting = this.onSubmitting.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.toggleConfirmation = this.toggleConfirmation.bind(this);
  }

  getInitialState() {
    const initialState = {
      confirming: false,
      startDate: null, //js Date object
      endDate: null, //js Date object
      startTime: null, //js Date object
      endTime: null, //js Date object
      purpose: "",
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
      this.props.room &&
      this.state.startDate &&
      this.state.startTime &&
      this.state.endDate &&
      this.state.endTime &&
      this.state.purpose
    );
  }

  onStartDateChange(startDate) {
    console.log("Start date changed:", startDate);
    this.setState({ startDate });
  }

  onEndDateChange(endDate) {
    console.log("End date changed:", endDate);
    this.setState({ endDate });
  }

  // startTime is a moment object.
  onStartTimeChange(startTime) {
    // parse to js Date object
    const newStartTime = startTime ? startTime.toDate() : null;
    console.log("Start time changed:", newStartTime);
    this.setState({ startTime: newStartTime });
  }

  // endTime is a moment object.
  onEndTimeChange(endTime) {
    // parse to js Date object
    const newEndTime = endTime ? endTime.toDate() : null;
    console.log("End time changed:", newEndTime);
    this.setState({ endTime: newEndTime });
  }

  onPurposeChange(event, { value }) {
    console.log("Booking purpose changed:", value);
    this.setState({ purpose: value });
  }

  async onSubmitting() {
    this.toggleConfirmation();
    this.props.toggleStatusBar(true);
  }


  handleOnSubmit() {
    this.onSubmitting()
      .then(() => {
        const data = {
          roomId: this.props.room.roomId,
          description: this.state.purpose,
          start: parseDateTime(this.state.startDate, this.state.startTime),
          end: parseDateTime(this.state.endDate, this.state.endTime)
        };
        Axios.post("api/rooms/bookings", data, {
          headers: { Authorization: `Bearer ${this.context.token}` }
        })
          .then(response => {
            console.log("POST response:", response);
            if (response.status === 200) {
              this.setState({ success: true });
              this.props.renderStatusBar(true, SUCCESS_MSG);
            }
          })
          .catch(({ response }) => {
            console.log("Error response:", response);
            var msg;
            switch (response.status) {
              case 400:
                msg = OVERLAP_CONFLICT_MSG;
                break;
              case 401:
                msg = UNAUTHORIZED_MSG;
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

  render() {
    return (
      <Card raised style={{ margin: "0 0 1em 0" }}>
        <Card.Content>
          <Card.Header textAlign="center">
            Book {this.props.room.roomName}
          </Card.Header>
        </Card.Content>
        <Card.Content>
          <Form>
            <DatePicker
              placeholder="Start date"
              onDateChange={this.onStartDateChange}
              disabled={this.state.success}
            />
            <Form.Field disabled={this.state.success}>
              <TimePicker
                placeholder="Start time"
                showInputIcon={this.state.startTime === ""}
                onChange={this.onStartTimeChange}
              />
            </Form.Field>
            <DatePicker
              placeholder="End date"
              onDateChange={this.onEndDateChange}
              disabled={this.state.success}
            />
            <Form.Field disabled={this.state.success}>
              <TimePicker
                placeholder="End time"
                showInputIcon={this.state.endTime === ""}
                onChange={this.onEndTimeChange}
              />
            </Form.Field>
            <Form.TextArea
              rows={8}
              label="Booking purpose"
              placeholder="Briefly describe the purpose for this booking..."
              onChange={this.onPurposeChange}
              disabled={this.state.success}
            />
          </Form>
        </Card.Content>
        <Card.Content>
          <Button
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
