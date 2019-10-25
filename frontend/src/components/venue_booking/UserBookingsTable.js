import React from "react";
import Axios from "axios";
import { Context } from "../../contexts/UserProvider";
import { Table } from "semantic-ui-react";
import StatusButton from "../common/StatusButton";
import { toDateTimeString } from "../../util/DateUtil";

class UserBookingsTable extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      bookings: []
    };

    this.renderBodyRow = this.renderBodyRow.bind(this);
    this.retrieveAllRequests = this.retrieveAllRequests.bind(this);
  }

  componentDidMount() {
    this.retrieveBookings();
  }

  retrieveBookings() {
    Axios.get("api/rooms/bookings", {
      headers: { Authorization: `Bearer ${this.context.token}` }
    }).then(response => {
      if (response.status === 200) {
        this.setState({ bookings: response.data });
      }
    });
  }

  renderBodyRow(data, index) {
    console.log(data);
    const {
      roomName,
      start,
      end,
      description,
      createdDate,
      approved,
      bookingId
    } = data;
    const status = approved;
    const [contactNum, numParticipants, purpose] = description.split("\n");
    const row = (
      <Table.Row>
        <Table.Cell>{roomName}</Table.Cell>
        <Table.Cell>{toDateTimeString(start)}</Table.Cell>
        <Table.Cell>{toDateTimeString(end)}</Table.Cell>
        <Table.Cell>{numParticipants}</Table.Cell>
        <Table.Cell>{purpose}</Table.Cell>
        <Table.Cell>{toDateTimeString(createdDate)}</Table.Cell>
        <Table.Cell>
          <StatusButton
            status={status}
            cancellable={true}
            bookingId={bookingId}
            updateTable={this.retrieveBookings}
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

export default UserBookingsTable;
