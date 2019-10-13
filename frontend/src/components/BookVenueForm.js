import React from "react";
import { Card, Form, Button, Icon } from "semantic-ui-react";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";

class BookVenueForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
  }

  onStartDateChange(startDate) {
    this.setState({ startDate });
  }

  onEndDateChange(endDate) {
    this.setState({ endDate });
  }

  onStartTimeChange(startTime) {
    this.setState({ startTime });
  }

  onEndTimeChange({ endTime }) {
    this.setState({ endTime });
  }

  onPurposeChange({ event, purpose }) {
    this.setState({ purpose });
  }

  render() {
    return (
      <Card raised style={{ margin: "0 0 1em 0" }}>
        <Card.Content>
          <Card.Header textAlign="center">Book Seminar Room 5</Card.Header>
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
              rows={5}
              required
              label="Booking purpose"
              placeholder="Briefly describe the purpose for this booking..."
            />
          </Form>
        </Card.Content>
        <Card.Content>
          <Button fluid type="submit">
            Submit
          </Button>
        </Card.Content>
      </Card>
    );
  }
}

export default BookVenueForm;
