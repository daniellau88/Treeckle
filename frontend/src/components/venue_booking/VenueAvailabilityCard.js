import React from "react";
import Axios from "axios";
import moment from "moment";
import { Card, Button, Form, Table } from "semantic-ui-react";
import DatePicker from "./DatePicker";
import "../../styles/VenueAvailabilityCard.scss";
import { Context } from "../../contexts/UserProvider";

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
  //this.context.token -> jwt token
  constructor(props) {
    super(props);

    this.state = {
      rooms: null,
      roomName: "",
      recommendedCapacity: "",
      roomId: "",
      date: 0,
      availabilityOptions: []
    };

    this.renderBodyRow = this.renderBodyRow.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.updateRoomOptions = this.updateRoomOptions.bind(this);
    this.updateDateChange = this.updateDateChange.bind(this);
    this.isValidFields = this.isValidFields.bind(this);
    this.updateAvailabilityOptions = this.updateAvailabilityOptions.bind(this);
    this.updateRoomChange = this.updateRoomChange.bind(this);
    this.onRoomChange = this.onRoomChange.bind(this);
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
    this.setState({ roomName, recommendedCapacity, roomId });
  }

  onDateChange(newDate) {
    const date = newDate ? moment(newDate).valueOf() : 0;
    if (date !== this.state.date) {
      this.updateDateChange(date).then(() => {
        if (this.isValidFields()) {
          this.updateAvailabilityOptions();
        }
      });
    }
  }

  onRoomChange(event, data) {
    console.log(data);
    this.updateRoomChange(
      data.options[data.value].text,
      data.options[data.value].recommendedCapacity,
      data.options[data.value].key
    ).then(() => {
      if (this.isValidFields()) {
        this.updateAvailabilityOptions();
      }
    });
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
    Axios.get(`api/rooms/categories/${this.props.category}`, {
      headers: { Authorization: `Bearer ${this.context.token}` }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data);
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
        console.log(rooms);
      }
    });
  }

  updateAvailabilityOptions() {
    Axios.get(
      `api/rooms/bookings/${this.state.roomId}/${this.state.date}-${this.state
        .date + 86400000}`,
      {
        headers: { Authorization: `Bearer ${this.context.token}` }
      }
    ).then(response => {
      if (response.status === 200) {
        const bookedSlots = response.data;
        console.log(bookedSlots);
        var availabilityOptions = defaultAvailabilityOptions;
        for (let i = 0; i < bookedSlots.length; i++) {
          const start = bookedSlots[i].startDate - this.state.date;
          const end = bookedSlots[i].endDate - this.state.date;
          const offset = moment("12:00 am", "h:mm a").valueOf();
          console.log(start, end);
          availabilityOptions = availabilityOptions.map(period => {
            const currentTime =
              moment(period.time, "h:mm a").valueOf() - offset;
            console.log(currentTime);
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
      }
    });
  }

  isValidFields() {
    console.log(this.state);
    return this.state.roomId && this.state.date;
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
              scrolling
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
          <Button fluid>Make a booking</Button>
        </Card.Content>
      </Card>
    );
  }
}

export default VenueAvailabilityCard;
