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

  // 0 => pending, 1 => approved, 2 => rejected, 3 => cancelled
  retrieveRequest(status) {
    return Axios.get(`api/rooms/bookings/all/${status}`, {
      headers: { Authorization: `Bearer ${this.context.token}` }
    });
  }

  retrieveAllRequests() {
    Axios.all([
      this.retrieveRequest(0),
      this.retrieveRequest(1),
      this.retrieveRequest(2),
      this.retrieveRequest(3)
    ]).then(
      Axios.spread(
        (
          pendingRequestsResponse,
          approvedRequestsResponse,
          rejectedRequestsResponse,
          cancelledRequestsResponses
        ) => {
          const pendingRequests = pendingRequestsResponse.data;
          const approvedRequests = approvedRequestsResponse.data;
          const rejectedRequests = rejectedRequestsResponse.data;
          const cancelledRequests = cancelledRequestsResponses.data;
          console.log(
            pendingRequests,
            approvedRequests,
            rejectedRequests,
            cancelledRequests
          );
          const allRequests = [
            ...pendingRequests,
            ...approvedRequests,
            ...rejectedRequests,
            ...cancelledRequests
          ];
          this.setState({
            allRequests,
            pendingRequests,
            approvedRequests,
            rejectedRequests,
            cancelledRequests
          });
        }
      )
    );
  }

  renderBodyRow(data, index) {
    const {
      createdByName,
      createdByEmail,
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
        <Table.Cell>{createdByName}</Table.Cell>
        <Table.Cell>{createdByEmail}</Table.Cell>
        <Table.Cell>{contactNum}</Table.Cell>
        <Table.Cell>{roomName}</Table.Cell>
        <Table.Cell>{toDateTimeString(start)}</Table.Cell>
        <Table.Cell>{toDateTimeString(end)}</Table.Cell>
        <Table.Cell>{numParticipants}</Table.Cell>
        <Table.Cell>{purpose}</Table.Cell>
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
