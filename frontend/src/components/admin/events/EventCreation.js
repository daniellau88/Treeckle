import React from "react";
import { Segment, Container } from "semantic-ui-react";
import { Context } from "../../../contexts/UserProvider";
import ImageUploader from "../../common/ImageUploader";

class EventCreation extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Container style={{ marginTop: "1em" }}>
        <Segment placeholder>
          <h1>
            Create your event
          </h1>
          <ImageUploader />
        </Segment>

        <Segment placeholder>
          <h1>
            Manage your events
          </h1>
        </Segment>
      </Container>
    );
  }
}

export default EventCreation;
