import React from "react";
import axios from "axios";
import { Card, Button, Form, Table, Icon } from "semantic-ui-react";
import DatePicker from "../../../common/DatePicker";
import "../../../../styles/ScrollableTable.scss";
import "../../../../styles/VenueAvailabilityCard.scss";
import { Context } from "../../../../contexts/UserProvider";
import { getUpdatedAvailabilityOptions } from "../../../../util/BookingUtil";
import { DAY_MILLISECONDS } from "../../../../util/Constants";
import { toTimeString, toDateString } from "../../../../util/DateUtil";
import { isAfter, subDays, addDays } from "date-fns";
import { CONSOLE_LOGGING } from "../../../../DevelopmentView";

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
    this.confirmBookingPeriod = this.confirmBookingPeriod.bind(this);
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
    this.handleOnNextDay = this.handleOnNextDay.bind(this);
    this.handleOnPreviousDay = this.handleOnPreviousDay.bind(this);
  }

  async onStartDateTimeChange(startDateTime) {
    this.setState({ startDateTime });
  }

  async onEndDateTimeChange(endDateTime) {
    this.setState({ endDateTime });
  }

  async handleRowClick(time) {
    if (!this.state.startDateTime) {
      CONSOLE_LOGGING && console.log("Start date/time selected:", time);
      this.onStartDateTimeChange(time).then(this.updateAvailabilityOptions);
    } else if (!this.state.endDateTime) {
      CONSOLE_LOGGING && console.log("End date/time selected:", time);
      this.onEndDateTimeChange(time).then(this.confirmBookingPeriod);
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
  }

  onStartDateChange(startDate) {
    if (startDate !== this.state.startDate) {
      CONSOLE_LOGGING && console.log("Start date changed:", startDate);
      this.updateStartDateChange(startDate).then(
        this.updateAvailabilityOptions
      );
    }
  }

  onEndDateChange(endDate) {
    CONSOLE_LOGGING && console.log("End date changed:", endDate);
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
      axios
        .get(
          `api/rooms/bookings/${
            this.props.venue.roomId
          }/${this.state.endDate.getTime()}-${this.state.endDate.getTime() +
            DAY_MILLISECONDS}`,
          {
            headers: { Authorization: `Bearer ${this.context.token}` }
          }
        )
        .then(response => {
          CONSOLE_LOGGING && console.log("GET room bookings:", response);
          if (response.status === 200) {
            const bookedSlots = response.data;
            const availabilityOptions = getUpdatedAvailabilityOptions(
              this.state.endDate,
              this.state.startDateTime,
              bookedSlots
            );
            this.setState({ availabilityOptions });
            CONSOLE_LOGGING &&
              console.log("Availability options updated:", availabilityOptions);
          }
        })
        .catch(({ response }) => {
          CONSOLE_LOGGING && console.log("GET room bookings error:", response);
          if (response.status === 401) {
            alert("Your current session has expired. Please log in again.");
            this.context.resetUser();
          }
        });
    } else {
      this.setState({ availabilityOptions: [] });
    }
  }

  confirmBookingPeriod(event, data) {
    const bookingPeriod = {
      venue: this.props.venue,
      start: this.state.startDateTime.getTime(),
      end: this.state.endDateTime.getTime()
    };
    this.props.renderBookingForm(bookingPeriod);
  }

  async onEdit() {
    this.setState({
      endDate: this.state.startDate,
      endDateTime: null
    });
  }

  handleEditButtonClick(event, data) {
    this.onEdit().then(this.updateAvailabilityOptions);
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
                  disabled={this.state.endDateTime !== null}
                />
              </Form.Field>
              {this.state.startDateTime && (
                <Form.Input
                  width={7}
                  label="Start time"
                  basic
                  value={toTimeString(this.state.startDateTime)}
                  readOnly
                  iconPosition="right"
                  icon={
                    this.state.endDateTime === null && (
                      <Icon
                        link
                        name="cancel"
                        onClick={() =>
                          this.onStartDateTimeChange(null).then(
                            this.updateAvailabilityOptions
                          )
                        }
                      />
                    )
                  }
                />
              )}
            </Form.Group>
            {this.state.endDateTime && (
              <Form.Group>
                <Form.Input
                  width={9}
                  label="End date"
                  basic
                  readOnly
                  value={toDateString(this.state.endDateTime)}
                />
                <Form.Input
                  width={7}
                  label="End time"
                  basic
                  readOnly
                  value={toTimeString(this.state.endDateTime)}
                />
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
                  className="scrollable-table"
                  style={{
                    maxHeight: "21em",
                    boxShadow: "none"
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
                  secondary
                />
                <Button
                  style={{ width: "48%" }}
                  size="mini"
                  compact
                  labelPosition="right"
                  icon="right chevron"
                  content="Next day"
                  onClick={this.handleOnNextDay}
                  secondary
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
              secondary
            >
              Edit booking period
            </Button>
          </Card.Content>
        )}
      </Card>
    );
  }
}

export default VenueAvailabilityCard;
