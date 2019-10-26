import React from "react";
import Axios from "axios";
import { Context } from "../../contexts/UserProvider";
import { Table, Segment } from "semantic-ui-react";
import StatusButton from "../buttons/StatusButton";
import { toDateTimeString } from "../../util/DateUtil";
import { CONSOLE_LOGGING } from "../../DevelopmentView";

class BookingsTable extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      allRequests: [],
      isLoading: true
    };

    this.renderBodyRow = this.renderBodyRow.bind(this);
    this.retrieveAllRequests = this.retrieveAllRequests.bind(this);
  }

  componentDidMount() {
    this.retrieveAllRequests();
  }

  retrieveAllRequests() {
    Axios.get(`api/rooms/bookings/all?limit=100`, {
      headers: { Authorization: `Bearer ${this.context.token}` }
    })
      .then(response => {
        CONSOLE_LOGGING && console.log("GET all booking requests:", response);
        if (response.status === 200) {
          this.setState({
            allRequests: response.data.bookings,
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

  renderBodyRow(data, index) {
    const {
      createdByName,
      createdByEmail,
      contactNumber,
      roomName,
      start,
      end,
      expectedAttendees,
      description,
      createdDate,
      approved,
      bookingId
    } = data;
    const status = approved;
    const row = (
      <Table.Row>
        <Table.Cell>{createdByName}</Table.Cell>
        <Table.Cell>{createdByEmail}</Table.Cell>
        <Table.Cell>{contactNumber}</Table.Cell>
        <Table.Cell>{roomName}</Table.Cell>
        <Table.Cell>{toDateTimeString(start)}</Table.Cell>
        <Table.Cell>{toDateTimeString(end)}</Table.Cell>
        <Table.Cell>{expectedAttendees}</Table.Cell>
        <Table.Cell>{description}</Table.Cell>
        <Table.Cell>{toDateTimeString(createdDate)}</Table.Cell>
        <Table.Cell>
          <StatusButton
            status={status}
            cancellable={false}
            bookingId={bookingId}
            updateTable={this.retrieveAllRequests}
          />
        </Table.Cell>
      </Table.Row>
    );
    return row;
  }

  render() {
    return this.state.allRequests.length > 0 ? (
      <Table
        headerRow={
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Contact number</Table.HeaderCell>
            <Table.HeaderCell>Venue</Table.HeaderCell>
            <Table.HeaderCell>Start</Table.HeaderCell>
            <Table.HeaderCell>End</Table.HeaderCell>
            <Table.HeaderCell>Number of participants</Table.HeaderCell>
            <Table.HeaderCell>Purpose</Table.HeaderCell>
            <Table.HeaderCell>Submitted at</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        }
        tableData={this.state.allRequests}
        renderBodyRow={this.renderBodyRow}
      />
    ) : (
      <Segment textAlign="center" size="huge" loading={this.state.isLoading}>
        There are currently no booking requests
      </Segment>
    );
  }
}

export default BookingsTable;
