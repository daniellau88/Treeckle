import React from "react";
import { Card, Form } from "semantic-ui-react";

class BookVenueForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Card raised style={{ margin: "0 0 1em 0" }}>
        <Card.Content>
          <Card.Header textAlign="center">Book Seminar Room 5</Card.Header>
        </Card.Content>
        <Card.Content></Card.Content>
      </Card>
    );
  }
}

export default BookVenueForm;
