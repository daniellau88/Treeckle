import React from "react";
import axios from "axios";
import { Context } from "../../../contexts/UserProvider";
import { Table, Segment, Popup, Button, Icon } from "semantic-ui-react";
import { toDateTimeString } from "../../../util/DateUtil";
import { CONSOLE_LOGGING } from "../../../DevelopmentView";
import "../../../styles/ScrollableTable.scss";
import ImageUploader from "../../common/ImageUploader";
import StatusBar from "../../common/StatusBar";

class EventsTable extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      allEvents: [],
      isLoading: true,
      image: null,
      status: null, // {success: boolean, message: string}
      updating: false // indicates if the update in poster or delete is still processing
    };

    this.renderBodyRow = this.renderBodyRow.bind(this);
    this.retrieveAllCreatedEvents = this.retrieveAllCreatedEvents.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.retrieveAllCreatedEvents();
  }


  retrieveAllCreatedEvents() {
    return axios.get(
      `/api/events/?historical=true&latestFirst=true`,
      {
        headers: { Authorization: `Bearer ${this.context.token}` }
      }
    )
      .then(resp => {
        if (resp.status == 200) {
          console.log("###", resp.data);
          const allEvents = resp.data;
          this.setState({
            allEvents,
            isLoading: false
          });

        }

      })
      .catch(({ response }) => {
        CONSOLE_LOGGING &&
          console.log("GET all booking requests error:", response);
        if (response.status === 401) {
          alert("Your current session has expired. Please log in again.");
          this.context.resetUser();
        }
      });
  }

  updatePoster(eventId) {
    const formData = new FormData();
    formData.append("image", this.state.image);
    formData.append("eventId", eventId);
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
            status: { success: true, message: "updated image" }
          });
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING &&
          console.log("PATCH upload poster error:", response);
        this.setState({
          status: { success: false, message: "error updating image" }
        });
      });
  }

  deleteEvent(eventId) {
    const data = {
      eventId: eventId
    };
    axios
      .delete("/api/events", {
        data: data,
        headers: { Authorization: `Bearer ${this.context.token}` }
      })
      .then(response => {
        CONSOLE_LOGGING && console.log("DELETE event", response);
        if (response.status === 200) {
          this.setState({
            status: { success: true, message: "deleted event" }
          });
        }

      })
      .catch(({ response }) => {
        CONSOLE_LOGGING && console.log("DELETE event error", response);
        this.setState({
          status: { success: false, message: "error deleting event" }
        });
      });
  }

  handleChange(event, { name, value }) {
    console.log(name, value);
    this.setState({ [name]: value });
  }

  renderBodyRow(data, index) {
    const {
      attendees,
      attendeesNames,
      capacity,
      categories,
      description,
      eventDate,
      eventId,
      organisedBy,
      posterPath,
      shortId,
      signupsAllowed,
      title,
      venue
    } = data;
    const row = (
      <Table.Row>
        <Table.Cell>
          <div>
            <Popup
              trigger={
                <Button icon>
                  <Icon color="red" name='delete' />
                </Button>
              }
              on="click"
              content={
                <div>
                  <Button fluid onClick={() => this.deleteEvent(eventId)}>Delete</Button>
                </div>
              }
              position="bottom center"
            />

            {title}
          </div>

        </Table.Cell>
        <Table.Cell>{toDateTimeString(eventDate)}</Table.Cell>
        <Table.Cell>{attendeesNames}</Table.Cell>
        <Table.Cell>
          <div>
            <Popup
              trigger={<Button>Change Poster</Button>}
              on="click"
              content={
                <div>

                  <ImageUploader
                    onChange={image =>
                      this.handleChange(null, { name: "image", value: image })
                    }
                  />
                  <Button fluid onClick={() => this.updatePoster(eventId)}>Update</Button>
                </div>
              }
              position="bottom center"
            />

          </div>
        </Table.Cell>
      </Table.Row>
    );
    return row;
  }

  render() {
    return (
      <div>
        {(this.state.status || this.state.updating) && (
          <StatusBar
            status={this.state.status}
            submitting={this.state.updating}
          />
        )}
        <div className="scrollable-table" style={{ maxHeight: "44em" }}>

          {this.state.allEvents.length > 0 ? (
            <Table
              selectable
              headerRow={
                <Table.Row>
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                  <Table.HeaderCell>Attendees</Table.HeaderCell>
                  <Table.HeaderCell>Poster</Table.HeaderCell>
                </Table.Row>
              }
              tableData={this.state.allEvents}
              renderBodyRow={this.renderBodyRow}
            />
          ) : (
              <Segment
                placeholder
                textAlign="center"
                size="huge"
                loading={this.state.isLoading}
              >
                There are currently no events created by you
          </Segment>
            )}
        </div>
      </div>
    );
  }
}

export default EventsTable;
