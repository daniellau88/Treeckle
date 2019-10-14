import React from "react";
import Axios from "axios";
import { Card, Button, Form, Table } from "semantic-ui-react";
import DatePicker from "./DatePicker";
import "../../styles/VenueAvailabilityCard.scss";
import { Context } from "../../contexts/UserProvider";

const roomOptions = [
  {
    key: "sr1",
    text: "Seminar Room 1",
    value: "Seminar Room 1"
  },
  {
    key: "sr2",
    text: "Seminar Room 2",
    value: "Seminar Room 2"
  },
  {
    key: "sr3",
    text: "Seminar Room 3",
    value: "Seminar Room 3"
  },
  {
    key: "sr4",
    text: "Seminar Room 4",
    value: "Seminar Room 4"
  },
  {
    key: "sr5",
    text: "Seminar Room 5",
    value: "Seminar Room 5"
  },
  {
    key: "sr6",
    text: "Seminar Room 6",
    value: "Seminar Room 6"
  }
];

const availabilityOptions = [
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
      roomName: "",
      recommendatedCapacity: "",
      roomId: "",
      date: "",
      availabilityOptions: availabilityOptions
    };

    this.renderBodyRow = this.renderBodyRow.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
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

  onDateChange(newDate) {
    const date = newDate ? newDate : "";
    this.setState(date);
    if (date && this.room) {
    }
  }

  updateAvailabilityOptions() {
    Axios.get("/api/rooms/bookings/:roomId/:start-:end");
  }

  render() {
    return (
      <Card raised style={{ margin: "0 0 1em 0" }}>
        <Card.Content>
          <Card.Header textAlign="center">View availability</Card.Header>
        </Card.Content>
        <Card.Content>
          <Form>
            <Form.Select options={roomOptions} placeholder="Choose room" />
            <DatePicker placeholder="Select date" />
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
              tableData={availabilityOptions}
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
