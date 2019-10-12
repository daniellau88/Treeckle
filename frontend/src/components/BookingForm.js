import React from "react";
import { Card, Button, Label, Grid } from "semantic-ui-react";

class BookingForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Card>
        <Grid divided="vertically">
          <Grid.Row columns={1}></Grid.Row>
        </Grid>
      </Card>
    );
  }
}

export default BookingForm;
