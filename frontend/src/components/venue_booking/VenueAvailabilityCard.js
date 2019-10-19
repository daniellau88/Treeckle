import React from "react";
import Axios from "axios";
import { Card, Button, Form, Table, Label } from "semantic-ui-react";
import DatePicker from "./DatePicker";
import "../../styles/VenueAvailabilityCard.scss";
import { Context } from "../../contexts/UserProvider";
import {
  getDefaultAvailabilityOptions,
  getUpdatedAvailabilityOptions
} from "../../util/BookingUtil";
import { DAY_MILLISECONDS } from "../../util/Constants";

const emptyAvailabilityOptions = getDefaultAvailabilityOptions();

class VenueAvailabilityCard extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      rooms: [],
      room: null,
      date: null,
      availabilityOptions: emptyAvailabilityOptions
    };

    this.renderBodyRow = this.renderBodyRow.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.updateRoomOptions = this.updateRoomOptions.bind(this);
    this.updateDateChange = this.updateDateChange.bind(this);
    this.areValidFields = this.areValidFields.bind(this);
    this.updateAvailabilityOptions = this.updateAvailabilityOptions.bind(this);
    this.updateRoomChange = this.updateRoomChange.bind(this);
    this.onRoomChange = this.onRoomChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  renderBodyRow(data, index) {
    const available = data.available === true;
    const unavailable = data.available === false;
    const notApplicable = data.available === null;
    const label = notApplicable ? "" : available ? "available" : "unavailable";
    return (
      <Table.Row>
        <Table.Cell>{data.time}</Table.Cell>
        <Table.Cell positive={available} negative={unavailable}>
          {label}
        </Table.Cell>
      </Table.Row>
    );
  }

  async updateDateChange(date) {
    this.setState({ date });
  }

  async updateRoomChange(roomName, recommendedCapacity, roomId) {
    const room = {
      roomName: roomName,
      recommendedCapacity: recommendedCapacity,
      roomId: roomId
    };
    this.setState({ room });
    console.log("Room changed:", room);
  }

  onDateChange(date) {
    if (date !== this.state.date) {
      this.updateDateChange(date).then(this.updateAvailabilityOptions);
    }
  }

  onRoomChange(event, data) {
    this.updateRoomChange(
      data.options[data.value].text,
      data.options[data.value].recommendedCapacity,
      data.options[data.value].key
    ).then(this.updateAvailabilityOptions);
  }

  componentDidUpdate(prevProps) {
    if (this.props.category !== prevProps.category) {
      this.updateRoomOptions();
    }
  }

  componentDidMount() {
    this.updateRoomOptions();
  }

  updateRoomOptions() {
    if (this.props.category) {
      Axios.get(`api/rooms/categories/${this.props.category}`, {
        headers: { Authorization: `Bearer ${this.context.token}` }
      })
        .then(response => {
          if (response.status === 200) {
            const data = response.data;
            const rooms = [];
            for (let i = 0; i < data.length; i++) {
              let room = data[i];
              rooms.push({
                key: room.roomId,
                text: room.name,
                value: i,
                recommendedCapacity: room.recommendedCapacity.toString()
              });
            }
            this.setState({ rooms });
            console.log("Room options updated:", rooms);
          }
        })
        .then(this.updateAvailabilityOptions);
    }
  }

  updateAvailabilityOptions() {
    if (this.areValidFields()) {
      Axios.get(
        `api/rooms/bookings/${
          this.state.room.roomId
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
    } else if (this.state.availabilityOptions !== emptyAvailabilityOptions) {
      this.setState({ availabilityOptions: emptyAvailabilityOptions });
    }
  }

  areValidFields() {
    return this.state.room && this.state.date;
  }

  handleButtonClick(event, data) {
    this.props.renderBookingForm(this.state.room);
  }

  render() {
    return (
      <Card raised style={{ margin: "0 0 1em 0" }}>
        <Card.Content>
          <Card.Header textAlign="center">Choose your slot(s)</Card.Header>
        </Card.Content>
        <Card.Content>
          <Form>
            <DatePicker
              placeholder="Select start date"
              onDateChange={this.onDateChange}
            />
          </Form>
          <div
            style={{ overflowY: "auto", maxHeight: "19em", marginTop: "1em" }}
          >
            <Table
              celled
              headerRow={
                <Table.Row>
                  <Table.HeaderCell>Time period</Table.HeaderCell>
                  <Table.HeaderCell>Availability</Table.HeaderCell>
                </Table.Row>
              }
              tableData={this.state.availabilityOptions}
              renderBodyRow={this.renderBodyRow}
            ></Table>
          </div>
        </Card.Content>
        <Card.Content>
          <Button
            fluid
            disabled={!this.areValidFields()}
            onClick={this.handleButtonClick}
          >
            Make a booking
          </Button>
        </Card.Content>
      </Card>
    );
  }
}

export default VenueAvailabilityCard;

/*
            <span>Selected venue: {this.props.category}</span>
            <Form.Select
              options={this.state.rooms}
              placeholder="Choose room"
              onChange={this.onRoomChange}
            />
            */
