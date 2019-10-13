import React from "react";
import {
  Card,
  Button,
  Dropdown,
  Form,
  Select,
  Container
} from "semantic-ui-react";

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

const weekOptions = [
  {
    key: "w9",
    text: "Week 9",
    value: "Week 9"
  },
  {
    key: "w10",
    text: "Week 10",
    value: "Week 10"
  },
  {
    key: "w11",
    text: "Week 11",
    value: "Week 11"
  },
  {
    key: "w12",
    text: "Week 12",
    value: "Week 12"
  },
  {
    key: "w13",
    text: "Week 13",
    value: "Week 13"
  }
];

class VenueAvailabilityCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Card raised style={{ margin: "0 0 1em 0" }}>
        <Card.Content>
          <Card.Header textAlign="center">Availability</Card.Header>
        </Card.Content>
        <Card.Content>
          <Form>
            <Form.Field
              control={Select}
              options={roomOptions}
              placeholder="Choose room"
            />
            <Form.Field
              control={Select}
              options={weekOptions}
              placeholder="Choose week"
            />
            <Form.Field label="Monday"></Form.Field>
            <Form.Field label="Tuesday"></Form.Field>
            <Form.Field label="Wednesday"></Form.Field>
            <Form.Field label="Thursday"></Form.Field>
            <Form.Field label="Friday"></Form.Field>
            <Form.Field label="Saturday"></Form.Field>
            <Form.Field label="Sunday"></Form.Field>
          </Form>
        </Card.Content>
        <Card.Content>
          <Button fluid>Make a booking</Button>
        </Card.Content>
      </Card>
    );
  }
}

export default VenueAvailabilityCard;
