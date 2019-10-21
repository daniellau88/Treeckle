import React from "react";
import Axios from "axios";
import { Card, Button, Form, Table } from "semantic-ui-react";
import DatePicker from "./DatePicker";
import "../../styles/VenueAvailabilityCard.scss";
import { Context } from "../../contexts/UserProvider";
import { getUpdatedAvailabilityOptions } from "../../util/BookingUtil";
import { DAY_MILLISECONDS } from "../../util/Constants";
import { toTimeString, toDateString } from "../../util/DateUtil";
import { isAfter, subDays, addDays, addMinutes } from "date-fns";

class VenueAvailabilityCard extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      startDate: null,
      endDate: null,
      availabilityOptions: [],
      startDateTime: null,
      endDateTime: null
    };

    this.renderBodyRow = this.renderBodyRow.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.updateAvailabilityOptions = this.updateAvailabilityOptions.bind(this);
    this.handleBookingButtonClick = this.handleBookingButtonClick.bind(this);
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
    this.handleOnNextDay = this.handleOnNextDay.bind(this);
    this.handleOnPreviousDay = this.handleOnPreviousDay.bind(this);
  }

  handleRowClick(time) {
    console.log(time);
    if (!this.state.startDateTime) {
      this.setState({ startDateTime: time });
    } else if (!this.state.endDateTime) {
      this.setState({ endDateTime: addMinutes(time, 30) });
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

  async updateStartDateChange(startDate) {
    this.setState({
      startDate,
      endDate: startDate,
      startDateTime: null,
      endDateTime: null
    });
  }

  async updateEndDateChange(endDate) {
    this.setState({ endDate });
    console.log(this.state);
  }

  onStartDateChange(startDate) {
    if (startDate !== this.state.startDate) {
      this.updateStartDateChange(startDate).then(
        this.updateAvailabilityOptions
      );
    }
  }

  onEndDateChange(endDate) {
    this.updateEndDateChange(endDate).then(this.updateAvailabilityOptions);
  }

  componentDidUpdate(prevProps) {
    if (this.props.venue !== prevProps.venue) {
      this.setState({ startDateTime: null, endDateTime: null });
      this.onEndDateChange(this.state.startDate);
    }
  }

  updateAvailabilityOptions() {
    if (this.state.endDate) {
      Axios.get(
        `api/rooms/bookings/${
          this.props.venue.roomId
        }/${this.state.endDate.getTime()}-${this.state.endDate.getTime() +
          DAY_MILLISECONDS}`,
        {
          headers: { Authorization: `Bearer ${this.context.token}` }
        }
      ).then(response => {
        console.log("GET room bookings:", response);
        if (response.status === 200) {
          const bookedSlots = response.data;
          const availabilityOptions = getUpdatedAvailabilityOptions(
            this.state.endDate,
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

  handleBookingButtonClick(event, data) {
    const bookingPeriod = {
      venue: this.props.venue,
      start: this.state.startDateTime.getTime(),
      end: this.state.endDateTime.getTime()
    };
    this.props.renderBookingForm(bookingPeriod);
  }

  handleEditButtonClick(event, data) {
    this.setState({ endDateTime: null });
  }

  handleOnPreviousDay(event, data) {
    const prevDay = subDays(this.state.endDate, 1);
    this.onEndDateChange(prevDay);
  }

  handleOnNextDay(event, data) {
    const nextDay = addDays(this.state.endDate, 1);
    this.onEndDateChange(nextDay);
  }

  render() {
    return (
      <Card raised style={{ margin: "0 0 1em 0" }}>
        <Card.Content style={{ flexGrow: 0 }}>
          <Card.Header textAlign="center">
            Select your booking period
          </Card.Header>
        </Card.Content>
        <Card.Content style={{ flexGrow: 0 }}>
          <Form>
            <Form.Group>
              <Form.Field width={9}>
                <label>Start date</label>
                <DatePicker
                  placeholder="Select date"
                  onDateChange={this.onStartDateChange}
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
            {!this.state.endDateTime && this.state.startDate && (
              <Form.Field>
                <label style={{ fontSize: "1.25rem" }}>
                  Select {this.state.startDateTime ? "end" : "start"} time
                </label>
                <div style={{ marginBottom: "0.5rem" }}>
                  Date: {toDateString(this.state.endDate)}
                </div>
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
            {!this.state.endDateTime && this.state.startDateTime && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <Button
                  style={{ width: "48%" }}
                  size="mini"
                  compact
                  labelPosition="left"
                  icon="left chevron"
                  content="Previous day"
                  disabled={!isAfter(this.state.endDate, this.state.startDate)}
                  onClick={this.handleOnPreviousDay}
                />
                <Button
                  style={{ width: "48%" }}
                  size="mini"
                  compact
                  labelPosition="right"
                  icon="right chevron"
                  content="Next day"
                  onClick={this.handleOnNextDay}
                />
              </div>
            )}
          </Form>
        </Card.Content>
        {this.state.endDateTime && (
          <Card.Content style={{ flexGrow: 0 }}>
            <Button
              fluid
              onClick={this.handleEditButtonClick}
              style={{ marginBottom: "1em" }}
            >
              Edit end time
            </Button>
            <Button primary fluid onClick={this.handleBookingButtonClick}>
              Proceed to booking form
            </Button>
          </Card.Content>
        )}
      </Card>
    );
  }
}

export default VenueAvailabilityCard;
