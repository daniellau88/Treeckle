import React from "react";
import axios from "axios";
import {
  Segment,
  Container,
  Grid,
  Header,
  Form,
  Button,
  Message
} from "semantic-ui-react";
import { Context } from "../../../contexts/UserProvider";
import ImageUploader from "../../common/ImageUploader";
import DatePicker from "../../common/DatePicker";
import TimePicker from "../../common/TimePicker";
import StatusBar from "../../common/StatusBar";
import { parseDateTime } from "../../../util/DateUtil";
import "../../../styles/EventCreation.scss";
import { CONSOLE_LOGGING } from "../../../DevelopmentView";
import { UNKNOWN_ERROR } from "../../../util/Constants";
import EventsTable from "./EventsTable";

const SUCCESS_MSG = "Your event has been successfully created.";
const MISSING_FIELDS = "Compulsory fields are missing.";
const IMAGE_UPLOAD_ERROR =
  "Image cannot be uploaded. Please try again at the created events page.";

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
      signupsAllowed: false,
      dateError: false,
      status: null, // {success: boolean, message: string}
      submitting: false // indicates if the submission is still processing
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event, { name, value }) {
    console.log(name, value);
    this.setState({ [name]: value });
  }

  handleSubmit() {
    if (this.isValidEventPeriod()) {
      const {
        title,
        description,
        startDate,
        startTime,
        categories,
        organisedBy,
        signupsAllowed,
        capacity,
        venue,
        image
      } = this.state;
      const data = {
        title: title,
        description: description,
        eventDate: parseDateTime(startDate, startTime.toDate()),
        categories: categories,
        organisedBy: organisedBy,
        signupsAllowed: signupsAllowed
      };
      if (capacity) {
        data.capacity = parseInt(capacity);
      }
      if (venue) {
        data.venue = venue;
      }
      CONSOLE_LOGGING && console.log("Event creation data sent:", data);
      axios
        .post("api/events", data, {
          headers: { Authorization: `Bearer ${this.context.token}` }
        })
        .then(response => {
          CONSOLE_LOGGING && console.log("POST create event:", response);
          if (response.status === 200) {
            if (image) {
              const formData = new FormData();
              formData.append("image", image);
              formData.append("eventId", response.data.eventId);
              axios
                .patch("api/events/image", formData, {
                  headers: {
                    Authorization: `Bearer ${this.context.token}`,
                    "Content-Type": "multipart/form-data"
                  }
                })
                .then(response => {
                  CONSOLE_LOGGING &&
                    console.log("PATCH upload poster:", response);
                  if (response.status === 200) {
                    this.setState({
                      status: { success: true, message: SUCCESS_MSG }
                    });
                  }
                })
                .catch(({ response }) => {
                  CONSOLE_LOGGING &&
                    console.log("PATCH upload poster error:", response);
                  this.setState({
                    status: { success: false, message: IMAGE_UPLOAD_ERROR }
                  });
                });
            } else {
              this.setState({
                status: { success: true, message: SUCCESS_MSG }
              });
            }
          }
        })
        .catch(({ response }) => {
          CONSOLE_LOGGING && console.log("POST create event date:", response);
          let msg;
          switch (response.status) {
            case 401:
              alert("Your current session has expired. Please log in again.");
              this.context.resetUser();
              break;
            case 422:
              msg = MISSING_FIELDS;
              break;
            default:
              msg = UNKNOWN_ERROR;
          }
          this.setState({ status: { success: false, message: msg } });
        });
    } else {
      this.setState({ dateError: true });
    }
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

  isValidEventPeriod() {
    const start = parseDateTime(
      this.state.startDate,
      this.state.startTime.toDate()
    );
    const end = parseDateTime(this.state.endDate, this.state.endTime.toDate());
    return start <= end;
  }

  render() {
    return (
      <Container>
        {(this.state.status || this.state.submitting) && (
          <StatusBar
            status={this.state.status}
            submitting={this.state.submitting}
          />
        )}
        <Segment placeholder style={{ marginTop: "1em" }}>
          <Grid columns={2} stackable>
            <Grid.Column verticalAlign="middle">
              <ImageUploader
                onChange={image =>
                  this.handleChange(null, { name: "image", value: image })
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
                  name="capacity"
                  onChange={this.handleChange}
                  type="number"
                  value={this.state.capacity}
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
                      onDateChange={date => {
                        this.setState({ dateError: false });
                        this.handleChange(null, {
                          name: "startDate",
                          value: date
                        });
                      }}
                    />
                  </Form.Field>
                  <Form.Field required>
                    <label>Start time</label>
                    <TimePicker
                      placeholder="Select start time"
                      onChange={time => {
                        this.setState({ dateError: false });
                        this.handleChange(null, {
                          name: "startTime",
                          value: time
                        });
                      }}
                      showInputIcon={this.state.startTime === null}
                    />
                  </Form.Field>
                </Form.Group>
                <Form.Group>
                  <Form.Field required error={this.state.dateError}>
                    <label>End date</label>
                    <DatePicker
                      placeholder="Select end date"
                      onDateChange={date => {
                        this.setState({ dateError: false });
                        this.handleChange(null, {
                          name: "endDate",
                          value: date
                        });
                      }}
                    />
                  </Form.Field>
                  <Form.Field required error={this.state.dateError}>
                    <label>End time</label>
                    <TimePicker
                      placeholder="Select end time"
                      onChange={time => {
                        this.setState({ dateError: false });
                        this.handleChange(null, {
                          name: "endTime",
                          value: time
                        });
                      }}
                      showInputIcon={this.state.endTime === null}
                    />
                  </Form.Field>
                </Form.Group>
                {this.state.dateError && (
                  <Message
                    error
                    content="End date/time cannot be earlier than start date/time."
                    style={{ display: "block", margin: "1em auto" }}
                  />
                )}
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
        <br />
        <br />
        <br />

        <h1 style={{ color: "#FDFDFD" }}>
          Manage your created events
        </h1>

        <EventsTable />

        <br />
        <br />
        <br />
      </Container>
    );
  }
}

export default EventCreation;
