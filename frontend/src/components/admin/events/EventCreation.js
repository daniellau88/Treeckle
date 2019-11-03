import React from "react";
import {
  Segment,
  Container,
  Grid,
  Header,
  Form,
  Button
} from "semantic-ui-react";
import { Context } from "../../../contexts/UserProvider";
import ImageUploader from "../../common/ImageUploader";
import DatePicker from "../../common/DatePicker";
import TimePicker from "../../common/TimePicker";
import "../../../styles/EventCreation.scss";

class EventCreation extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      image: null,
      title: "",
      capacity: "",
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      venue: "",
      description: "",
      categories: [],
      organisedBy: "",
      signupsAllowed: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event, { name, value }) {
    this.setState({ [name]: value });
    console.log(name, value);
    console.log(this.state);
  }

  handleSubmit() {
    console.log("submit");
  }

  areValidFields() {
    return (
      this.state.title &&
      this.state.organisedBy &&
      this.state.startDate &&
      this.state.startTime &&
      this.state.endDate &&
      this.state.endTime
    );
  }

  render() {
    return (
      <Container style={{ marginTop: "1em" }}>
        <Segment placeholder>
          <Grid columns={2} stackable>
            <Grid.Column verticalAlign="middle">
              <ImageUploader
                onChange={image =>
                  this.handleChange(null, { image: "image", value: image })
                }
              />
            </Grid.Column>
            <Grid.Column>
              <Header textAlign="center">Event creation form</Header>
              <Form className="event-creation">
                <Form.Input
                  label="Event title"
                  name="title"
                  onChange={this.handleChange}
                  required
                  value={this.state.title}
                />
                <Form.Input
                  label="Organised by"
                  name="organisedBy"
                  onChange={this.handleChange}
                  required
                  value={this.state.organisedBy}
                />
                <Form.Input
                  label="Capacity"
                  type="number"
                  name="capacity"
                  onChange={this.handleChange}
                  value={parseInt(this.state.capacity)}
                />
                <Form.Input
                  label="Venue"
                  name="venue"
                  onChange={this.handleChange}
                  value={this.state.venue}
                />
                <Form.Group>
                  <Form.Field required>
                    <label>Start date</label>
                    <DatePicker
                      placeholder="Select start date"
                      onDateChange={date =>
                        this.handleChange(null, {
                          name: "startDate",
                          value: date
                        })
                      }
                    />
                  </Form.Field>
                  <Form.Field required>
                    <label>Start time</label>
                    <TimePicker
                      placeholder="Select start time"
                      onChange={time =>
                        this.handleChange(null, {
                          name: "startTime",
                          value: time
                        })
                      }
                      showInputIcon={this.state.startTime === null}
                    />
                  </Form.Field>
                </Form.Group>
                <Form.Group>
                  <Form.Field required>
                    <label>End date</label>
                    <DatePicker
                      placeholder="Select end date"
                      onDateChange={date =>
                        this.handleChange(null, {
                          name: "endDate",
                          value: date
                        })
                      }
                    />
                  </Form.Field>
                  <Form.Field required>
                    <label>End time</label>
                    <TimePicker
                      placeholder="Select end time"
                      onChange={time =>
                        this.handleChange(null, {
                          name: "endTime",
                          value: time
                        })
                      }
                      showInputIcon={this.state.endTime === null}
                    />
                  </Form.Field>
                </Form.Group>
                <Form.TextArea
                  rows={8}
                  label="Description"
                  name="description"
                  onChange={this.handleChange}
                  value={this.state.description}
                />
                <Form.Group>
                  <Form.Radio
                    label="Allow sign-ups"
                    name="signupsAllowed"
                    onChange={(event, { name, checked }) =>
                      this.handleChange(event, { name: name, value: checked })
                    }
                    toggle
                    checked={this.state.signupsAllowed}
                  />
                  <Button
                    fluid
                    content="Create"
                    onClick={this.handleSubmit}
                    primary
                    disabled={!this.areValidFields()}
                  />
                </Form.Group>
              </Form>
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
    );
  }
}

export default EventCreation;
