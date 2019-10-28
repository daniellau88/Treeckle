import React from "react";
import { Segment, Container } from "semantic-ui-react";
import { Context } from "../../../contexts/UserProvider";

class EventCreation extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Container style={{ marginTop: "1em" }}>
        <Segment placeholder />
      </Container>
    );
  }
}

export default EventCreation;
