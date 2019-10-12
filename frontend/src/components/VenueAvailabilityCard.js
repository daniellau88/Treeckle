import React from "react";
import { Card, Button, Container } from "semantic-ui-react";

class VenueAvailabilityCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick(event, data) {
    this.setState({ activeButton: data.name });
  }

  render() {
    const { activeButton } = this.state;

    return (
      <Card>
        <Card.Content>
          <Card.Header textAlign="center">Select a venue</Card.Header>
        </Card.Content>
        <Card.Content>
          <Button.Group vertical basic fluid>
            <Button
              name="sr"
              active={activeButton === "sr"}
              onClick={this.handleButtonClick}
            >
              <Container type="text">Seminar Rooms</Container>
            </Button>
            <Button
              name="tr"
              active={activeButton === "tr"}
              onClick={this.handleButtonClick}
            >
              <Container type="text">Theme Rooms</Container>
            </Button>
            <Button
              name="mpsh"
              active={activeButton === "mpsh"}
              onClick={this.handleButtonClick}
            >
              <Container type="text">Multi-Purpose Sports Hall</Container>
            </Button>
            <Button
              name="cl"
              active={activeButton === "cl"}
              onClick={this.handleButtonClick}
            >
              <Container type="text">Common Lounge</Container>
            </Button>
          </Button.Group>
        </Card.Content>
      </Card>
    );
  }
}

export default VenueAvailabilityCard;
