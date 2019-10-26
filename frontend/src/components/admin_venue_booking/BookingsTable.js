import React from "react";
import Axios from "axios";
import { Context } from "../../contexts/UserProvider";
import { Table } from "semantic-ui-react";
import StatusButton from "../buttons/StatusButton";
import { toDateTimeString } from "../../util/DateUtil";

class BookingsTable extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      allRequests: [],
      pendingRequests: [],
      approvedRequests: [],
      rejectedRequests: [],
      cancelledRequests: []
    };

    this.renderBodyRow = this.renderBodyRow.bind(this);
    this.retrieveAllRequests = this.retrieveAllRequests.bind(this);
  }

  componentDidMount() {
    this.retrieveAllRequests();
  }

  retrieveRequest(status) {
    Axios.get(`api/rooms/bookings/all/${status}`, {
      headers: { Authorization: `Bearer ${this.context.token}` }
    });
  }

  retrieveAllRequests() {
    Axios.get(`api/rooms/bookings/all?limit=100`, {
      headers: { Authorization: `Bearer ${this.context.token}` }
    })
      .then(response => {
        if (response.status === 200) {
          this.setState({ allRequests: response.data.bookings });
        }
      })
      .catch(({ response }) => {
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
    return (
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
    );
  }
}

export default BookingsTable;
