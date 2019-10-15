import React from "react";
import Axios from "axios";
import moment from "moment";
import { Card, Button, Form, Table, Select } from "semantic-ui-react";
import DatePicker from "./DatePicker";
import "../../styles/VenueAvailabilityCard.scss";
import { Context } from "../../contexts/UserProvider";

// number of milliseconds in 1 day
const NEXT_DAY = 24 * 60 * 60 * 1000;

const emptyAvailabilityOptions = [
  {
    time: "12:00 am",
    availability: ""
  },
  {
    time: "12:30 am",
    availability: ""
  },
  {
    time: "1:00 am",
    availability: ""
  },
  {
    time: "1:30 am",
    availability: ""
  },
  {
    time: "2:00 am",
    availability: ""
  },
  {
    time: "2:30 am",
    availability: ""
  },
  {
    time: "3:00 am",
    availability: ""
  },
  {
    time: "3:30 am",
    availability: ""
  },
  {
    time: "4:00 am",
    availability: ""
  },
  {
    time: "4:30 am",
    availability: ""
  },
  {
    time: "5:00 am",
    availability: ""
  },
  {
    time: "5:30 am",
    availability: ""
  },
  {
    time: "6:00 am",
    availability: ""
  },
  {
    time: "6:30 am",
    availability: ""
  },
  {
    time: "7:00 am",
    availability: ""
  },
  {
    time: "7:30 am",
    availability: ""
  },
  {
    time: "8:00 am",
    availability: ""
  },
  {
    time: "8:30 am",
    availability: ""
  },
  {
    time: "9:00 am",
    availability: ""
  },
  {
    time: "9:30 am",
    availability: ""
  },
  {
    time: "10:00 am",
    availability: ""
  },
  {
    time: "10:30 am",
    availability: ""
  },
  {
    time: "11:00 am",
    availability: ""
  },
  {
    time: "11:30 am",
    availability: ""
  },
  {
    time: "12:00 pm",
    availability: ""
  },
  {
    time: "12:30 pm",
    availability: ""
  },
  {
    time: "1:00 pm",
    availability: ""
  },
  {
    time: "1:30 pm",
    availability: ""
  },
  {
    time: "2:00 pm",
    availability: ""
  },
  {
    time: "2:30 pm",
    availability: ""
  },
  {
    time: "3:00 pm",
    availability: ""
  },
  {
    time: "3:30 pm",
    availability: ""
  },
  {
    time: "4:00 pm",
    availability: ""
  },
  {
    time: "4:30 pm",
    availability: ""
  },
  {
    time: "5:00 pm",
    availability: ""
  },
  {
    time: "5:30 pm",
    availability: ""
  },
  {
    time: "6:00 pm",
    availability: ""
  },
  {
    time: "6:30 pm",
    availability: ""
  },
  {
    time: "7:00 pm",
    availability: ""
  },
  {
    time: "7:30 pm",
    availability: ""
  },
  {
    time: "8:00 pm",
    availability: ""
  },
  {
    time: "8:30 pm",
    availability: ""
  },
  {
    time: "9:00 pm",
    availability: ""
  },
  {
    time: "9:30 pm",
    availability: ""
  },
  {
    time: "10:00 pm",
    availability: ""
  },
  {
    time: "10:30 pm",
    availability: ""
  },
  {
    time: "11:00 pm",
    availability: ""
  },
  {
    time: "11:30 pm",
    availability: ""
  }
];

const defaultAvailabilityOptions = [
  {
    time: "12:00 am",
    availability: "available"
  },
  {
    time: "12:30 am",
    availability: "available"
  },
  {
    time: "1:00 am",
    availability: "available"
  },
  {
    time: "1:30 am",
    availability: "available"
  },
  {
    time: "2:00 am",
    availability: "available"
  },
  {
    time: "2:30 am",
    availability: "available"
  },
  {
    time: "3:00 am",
    availability: "available"
  },
  {
    time: "3:30 am",
    availability: "available"
  },
  {
    time: "4:00 am",
    availability: "available"
  },
  {
    time: "4:30 am",
    availability: "available"
  },
  {
    time: "5:00 am",
    availability: "available"
  },
  {
    time: "5:30 am",
    availability: "available"
  },
  {
    time: "6:00 am",
    availability: "available"
  },
  {
    time: "6:30 am",
    availability: "available"
  },
  {
    time: "7:00 am",
    availability: "available"
  },
  {
    time: "7:30 am",
    availability: "available"
  },
  {
    time: "8:00 am",
    availability: "available"
  },
  {
    time: "8:30 am",
    availability: "available"
  },
  {
    time: "9:00 am",
    availability: "available"
  },
  {
    time: "9:30 am",
    availability: "available"
  },
  {
    time: "10:00 am",
    availability: "available"
  },
  {
    time: "10:30 am",
    availability: "available"
  },
  {
    time: "11:00 am",
    availability: "available"
  },
  {
    time: "11:30 am",
    availability: "available"
  },
  {
    time: "12:00 pm",
    availability: "available"
  },
  {
    time: "12:30 pm",
    availability: "available"
  },
  {
    time: "1:00 pm",
    availability: "available"
  },
  {
    time: "1:30 pm",
    availability: "available"
  },
  {
    time: "2:00 pm",
    availability: "available"
  },
  {
    time: "2:30 pm",
    availability: "available"
  },
  {
    time: "3:00 pm",
    availability: "available"
  },
  {
    time: "3:30 pm",
    availability: "available"
  },
  {
    time: "4:00 pm",
    availability: "available"
  },
  {
    time: "4:30 pm",
    availability: "available"
  },
  {
    time: "5:00 pm",
    availability: "available"
  },
  {
    time: "5:30 pm",
    availability: "available"
  },
  {
    time: "6:00 pm",
    availability: "available"
  },
  {
    time: "6:30 pm",
    availability: "available"
  },
  {
    time: "7:00 pm",
    availability: "available"
  },
  {
    time: "7:30 pm",
    availability: "available"
  },
  {
    time: "8:00 pm",
    availability: "available"
  },
  {
    time: "8:30 pm",
    availability: "available"
  },
  {
    time: "9:00 pm",
    availability: "available"
  },
  {
    time: "9:30 pm",
    availability: "available"
  },
  {
    time: "10:00 pm",
    availability: "available"
  },
  {
    time: "10:30 pm",
    availability: "available"
  },
  {
    time: "11:00 pm",
    availability: "available"
  },
  {
    time: "11:30 pm",
    availability: "available"
  }
];

class VenueAvailabilityCard extends React.Component {
  static contextType = Context;
  //this.context.token => jwt token
  constructor(props) {
    super(props);

    this.state = {
      rooms: [],
      room: null,
      date: 0,
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
    return (
      <Table.Row>
        <Table.Cell>{data.time}</Table.Cell>
        <Table.Cell
          positive={data.availability === "available"}
          negative={data.availability === "unavailable"}
        >
          {data.availability}
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

  onDateChange(newDate) {
    const date = newDate ? moment(newDate).valueOf() : 0;
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
        `api/rooms/bookings/${this.state.room.roomId}/${this.state.date}-${this
          .state.date + NEXT_DAY}`,
        {
          headers: { Authorization: `Bearer ${this.context.token}` }
        }
      ).then(response => {
        if (response.status === 200) {
          const bookedSlots = response.data;
          var availabilityOptions = defaultAvailabilityOptions;
          for (let i = 0; i < bookedSlots.length; i++) {
            const start = bookedSlots[i].startDate - this.state.date;
            const end = bookedSlots[i].endDate - this.state.date;
            const offset = moment("12:00 am", "h:mm a").valueOf();
            availabilityOptions = availabilityOptions.map(period => {
              const currentTime =
                moment(period.time, "h:mm a").valueOf() - offset;
              return {
                time: period.time,
                availability:
                  start <= currentTime && currentTime < end
                    ? "unavailable"
                    : "available"
              };
            });
          }
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
          <Card.Header textAlign="center">View availability</Card.Header>
        </Card.Content>
        <Card.Content>
          <Form>
            <Form.Select
              options={this.state.rooms}
              placeholder="Choose room"
              onChange={this.onRoomChange}
            />
            <DatePicker
              placeholder="Select date"
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
