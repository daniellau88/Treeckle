import React from "react";
import axios from "axios";
import { Context } from "../../../../contexts/UserProvider";
import { Table, Segment } from "semantic-ui-react";
import StatusButton from "../../../common/StatusButton";
import { toDateTimeString } from "../../../../util/DateUtil";
import { CONSOLE_LOGGING } from "../../../../DevelopmentView";
import "../../../../styles/ScrollableTable.scss";

class UserBookingsTable extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      isLoading: true
    };

    this.renderBodyRow = this.renderBodyRow.bind(this);
    this.retrieveBookings = this.retrieveBookings.bind(this);
  }

  componentDidMount() {
    this.retrieveBookings();
  }

  retrieveBookings() {
    axios
      .get("api/rooms/bookings", {
        headers: { Authorization: `Bearer ${this.context.token}` }
      })
      .then(response => {
        CONSOLE_LOGGING && console.log("GET own bookings:", response);
        if (response.status === 200) {
          this.setState({ bookings: response.data, isLoading: false });
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING && console.log("GET own bookings error:", response);
        if (response.status === 401) {
          alert("Your current session has expired. Please log in again.");
          this.context.resetUser();
        }
      });
  }

  renderBodyRow(data, index) {
    const {
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
      <Table.Row key={bookingId}>
        <Table.Cell>{roomName}</Table.Cell>
        <Table.Cell>{toDateTimeString(start)}</Table.Cell>
        <Table.Cell>{toDateTimeString(end)}</Table.Cell>
        <Table.Cell>{expectedAttendees}</Table.Cell>
        <Table.Cell>{description}</Table.Cell>
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
      <div
        className="scrollable-table"
        style={{
          maxHeight: "37em"
        }}
      >
        <Table
          selectable
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
      </div>
    ) : (
      <Segment
        placeholder
        textAlign="center"
        size="big"
        loading={this.state.isLoading}
      >
        You currently do not have any bookings
      </Segment>
    );
  }
}

export default UserBookingsTable;
