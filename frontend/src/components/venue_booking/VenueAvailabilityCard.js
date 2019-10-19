import React from "react";
import Axios from "axios";
import { Card, Button, Form, Table, Segment } from "semantic-ui-react";
import DatePicker from "./DatePicker";
import "../../styles/VenueAvailabilityCard.scss";
import { Context } from "../../contexts/UserProvider";
import { getUpdatedAvailabilityOptions } from "../../util/BookingUtil";
import { DAY_MILLISECONDS } from "../../util/Constants";
import { toTimeString, toDateString } from "../../util/DateUtil";

class VenueAvailabilityCard extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      date: null,
      availabilityOptions: [],
      startDateTime: null,
      endDateTime: null
    };

    this.renderBodyRow = this.renderBodyRow.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.updateDateChange = this.updateDateChange.bind(this);
    this.areValidFields = this.areValidFields.bind(this);
    this.updateAvailabilityOptions = this.updateAvailabilityOptions.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleRowClick(time) {
    console.log(time);
    if (!this.state.startDateTime) {
      this.setState({ startDateTime: time });
    } else if (!this.state.endDateTime) {
      this.setState({ endDateTime: time });
    }
  }

  renderBodyRow(data, index) {
    const available = data.available;
    const row = (
      <Table.Row onClick={this.handleRowClick.bind(this, data.time)}>
        <Table.Cell disabled={!available}>{data.timeFormat}</Table.Cell>
        <Table.Cell
          positive={available}
          negative={!available}
          disabled={!available}
        >
          {available ? "available" : "unavailable"}
        </Table.Cell>
      </Table.Row>
    );
    return row;
  }

  async updateDateChange(date) {
    this.setState({ date, startDateTime: null, endDateTime: null });
  }

  onDateChange(date) {
    if (date !== this.state.date) {
      this.updateDateChange(date).then(this.updateAvailabilityOptions);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.category !== prevProps.category) {
      this.setState({ startDateTime: null, endDateTime: null });
      this.updateAvailabilityOptions();
    }
  }

  updateAvailabilityOptions() {
    if (this.areValidFields()) {
      Axios.get(
        `api/rooms/bookings/${
          this.props.category
        }/${this.state.date.getTime()}-${this.state.date.getTime() +
          DAY_MILLISECONDS}`,
        {
          headers: { Authorization: `Bearer ${this.context.token}` }
        }
      ).then(response => {
        console.log("GET room bookings:", response);
        if (response.status === 200) {
          const bookedSlots = response.data;
          const availabilityOptions = getUpdatedAvailabilityOptions(
            this.state.date,
            bookedSlots
          );
          this.setState({ availabilityOptions });
          console.log("Availability options updated:", availabilityOptions);
        }
      });
    } else {
      this.setState({ availabilityOptions: [] });
    }
  }

  areValidFields() {
    return this.state.date !== null;
  }

  handleButtonClick(event, data) {
    console.log("Make booking clicked");
    //this.props.renderBookingForm(this.state.room);
  }

  render() {
    return (
      <Card raised style={{ margin: "0 0 1em 0" }}>
        <Card.Content style={{ flexGrow: 0 }}>
          <Card.Header textAlign="center">Choose your slot(s)</Card.Header>
        </Card.Content>
        <Card.Content>
          <Form>
            <Form.Group>
              <Form.Field width={9}>
                <label>Start date</label>
                <DatePicker
                  placeholder="Select date"
                  onDateChange={this.onDateChange}
                />
              </Form.Field>
              {this.state.startDateTime && (
                <Form.Field width={7}>
                  <label>Start time</label>
                  <input
                    basic
                    readOnly
                    placeholder={toTimeString(this.state.startDateTime)}
                  />
                </Form.Field>
              )}
            </Form.Group>
            {this.state.endDateTime && (
              <Form.Group>
                <Form.Field width={9}>
                  <label>End date</label>
                  <input
                    basic
                    readOnly
                    placeholder={toDateString(this.state.endDateTime)}
                  />
                </Form.Field>
                <Form.Field width={7}>
                  <label>End time</label>
                  <input
                    basic
                    readOnly
                    placeholder={toTimeString(this.state.endDateTime)}
                  />
                </Form.Field>
              </Form.Group>
            )}
            {!this.state.endDateTime && this.state.date && (
              <Form.Field>
                <label>
                  Select {this.state.startDateTime ? "end" : "start"} time
                </label>
                <div
                  style={{
                    overflowY: "auto",
                    maxHeight: "19em"
                  }}
                >
                  <Table
                    selectable
                    celled
                    headerRow={
                      <Table.Row>
                        <Table.HeaderCell>Time period</Table.HeaderCell>
                        <Table.HeaderCell>Availability</Table.HeaderCell>
                      </Table.Row>
                    }
                    tableData={this.state.availabilityOptions}
                    renderBodyRow={this.renderBodyRow}
                  />
                </div>
              </Form.Field>
            )}
          </Form>
        </Card.Content>
        {this.state.endDateTime && (
          <Card.Content flexGrow={0}>
            <Button
              fluid
              onClick={this.handleButtonClick}
              style={{ marginBottom: "1em" }}
            >
              Edit
            </Button>
            <Button fluid onClick={this.handleButtonClick}>
              Make a booking
            </Button>
          </Card.Content>
        )}
      </Card>
    );
  }
}

export default VenueAvailabilityCard;
