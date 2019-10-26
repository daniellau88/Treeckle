import React from "react";
import Axios from "axios";
import { Context } from "../../contexts/UserProvider";
import { Table, Segment } from "semantic-ui-react";
import StatusButton from "../buttons/StatusButton";
import { toDateTimeString } from "../../util/DateUtil";

class UserBookingsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: []
    };

    this.renderBodyRow = this.renderBodyRow.bind(this);
    this.retrieveBookings = this.retrieveBookings.bind(this);
  }

  componentDidMount() {
    console.log(this.context);
    this.retrieveBookings();
  }

  retrieveBookings() {
    Axios.get("api/rooms/bookings", {
      headers: { Authorization: `Bearer ${this.context.token}` }
    }).then(response => {
      console.log(response);
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
    return this.state.bookings.length > 0 ? (
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
        tableData={this.state.bookings}
        renderBodyRow={this.renderBodyRow}
      />
    ) : (
      <Segment textAlign="center" size="huge">
        You currently do not have any bookings
      </Segment>
    );
  }
}

UserBookingsTable.contextType = Context;

export default UserBookingsTable;
