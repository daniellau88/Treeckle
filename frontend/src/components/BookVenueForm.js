import React from "react";
import { Card, Button, Container } from "semantic-ui-react";

class BookVenueForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Card>
        <Card.Content>
          <Card.Header textAlign="center">Book Seminar Room 5</Card.Header>
        </Card.Content>
      </Card>
    );
  }
}

export default BookVenueForm;
