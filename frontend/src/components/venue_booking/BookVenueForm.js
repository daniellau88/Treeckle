import React from "react";
import Axios from "axios";
import { Card, Form, Button, Confirm } from "semantic-ui-react";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import { getTime, set, getMinutes } from "date-fns";
import { Context } from "../../contexts/UserProvider";

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

    this.state = {
      confirming: false,
      submitting: false,
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      purpose: ""
    };

    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.onStartTimeChange = this.onStartTimeChange.bind(this);
    this.onEndTimeChange = this.onEndTimeChange.bind(this);
    this.onPurposeChange = this.onPurposeChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.areValidFields = this.areValidFields.bind(this);
    this.toggleConfirmation = this.toggleConfirmation.bind(this);
    this.onSubmitting = this.onSubmitting.bind(this);
  }

  onStartDateChange(newStartDate) {
    const startDate = newStartDate ? newStartDate : "";
    console.log("Start date changed:", startDate);
    this.setState({ startDate });
  }

  onEndDateChange(newEndDate) {
    const endDate = newEndDate ? newEndDate : "";
    console.log("End date changed:", endDate);
    this.setState({ endDate });
  }

  onStartTimeChange(newStartTime) {
    console.log(newStartTime);
    console.log(typeof newStartTime.format("HH:mm"));
    console.log(getMinutes(newStartTime.format("HH:mm")));
    const startTime = newStartTime
      ? newStartTime.format("HH:mm").toString()
      : "";
    console.log("Start time changed:", startTime);
    this.setState({ startTime });
  }

  onEndTimeChange(newEndTime) {
    const endTime = newEndTime ? newEndTime.format("HH:mm").toString() : "";
    console.log("End time changed:", endTime);
    this.setState({ endTime });
  }

  onPurposeChange(event, data) {
    const purpose = data.value;
    console.log("Booking purpose changed:", purpose);
    this.setState({ purpose });
  }

  async onSubmitting() {
    this.setState({ submitting: true });
  }

  handleOnSubmit() {
    this.onSubmitting()
      .then(() => {
        const data = {
          roomId: this.props.room.roomId,
          description: this.state.purpose,
          start: getTime(this.state.startDate, this.state.startTime),
          end: getTime(this.state.endDate, this.state.endTime)
        };
        Axios.post("api/rooms/bookings", data, {
          headers: { Authorization: `Bearer ${this.context.token}` }
        })
          .then(response => {
            console.log(response);
            if (response.status === 200) {
              this.props.renderSuccessStatusBar(SUCCESS_MSG);
            }
          })
          .catch(({ response }) => {
            console.log(response);
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
            this.props.renderErrorStatusBar(msg);
          });
      })
      .then(() => {
        this.setState({ submitting: false });
        this.toggleConfirmation();
      });
  }

  toggleConfirmation() {
    this.setState({ confirming: !this.state.confirming });
  }

  areValidFields() {
    return (
      this.state.startDate &&
      this.state.startTime &&
      this.state.endDate &&
      this.state.endTime &&
      this.state.purpose
    );
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
            />
            <Form.Field>
              <TimePicker
                placeholder="Start time"
                showInputIcon={this.state.startTime === ""}
                onChange={this.onStartTimeChange}
              />
            </Form.Field>
            <DatePicker
              placeholder="End date"
              onDateChange={this.onEndDateChange}
            />
            <Form.Field>
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
            />
          </Form>
        </Card.Content>
        <Card.Content>
          <Button
            fluid
            disabled={!this.areValidFields()}
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
