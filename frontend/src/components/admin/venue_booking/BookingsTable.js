import React from "react";
import axios from "axios";
import { Context } from "../../../contexts/UserProvider";
import { Dropdown, Table, Segment } from "semantic-ui-react";
import StatusButton from "../../common/StatusButton";
import { toDateTimeString } from "../../../util/DateUtil";
import { CONSOLE_LOGGING } from "../../../DevelopmentView";
import "../../../styles/ScrollableTable.scss";

class BookingsTable extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      allRequests: [],
      isLoading: true,
      filteredArray: [],
    };

    this.options = [
      { key: 0, text: "Pending", value: "Pending" },
      { key: 1, text: "Approved", value: "Approved" },
      { key: 2, text: "Rejected", value: "Rejected" },
      { key: 3, text: "Cancelled", value: "Cancelled" }
    ];

    this.renderBodyRow = this.renderBodyRow.bind(this);
    this.renderLabel = this.renderLabel.bind(this);
    this.retrieveAllRequests = this.retrieveAllRequests.bind(this);
    this.onLabelClick = this.onLabelClick.bind(this);

  }

  componentDidMount() {
    this.retrieveAllRequests();
  }

  renderLabel(label) {
    let labelColor;
    switch (label.key) {
      case 0:
        labelColor = "orange";
        break;
      case 1:
        labelColor = "green";
        break;
      case 2:
        labelColor = "red";
        break;
      case 3:
        labelColor = "black";
        break;
      default:
        labelColor = "standard";
    }

    return {
      color: labelColor,
      content: label.text,
      icon: 'check'
    }

  }

  onLabelClick() {

  }

  retrievePendingRequests() {
    return axios.get(
      `../api/rooms/bookings/all?Approved=0&Rejected=0&Cancelled=0&limit=1000`,
      {
        headers: { Authorization: `Bearer ${this.context.token}` }
      }
    );
  }

  retrieveApprovedRequests() {
    return axios.get(
      `../api/rooms/bookings/all?Cancelled=0&Rejected=0&Pending=0&limit=1000`,
      {
        headers: { Authorization: `Bearer ${this.context.token}` }
      }
    );
  }

  retrieveRejectedRequests() {
    return axios.get(
      `../api/rooms/bookings/all?Approved=0&Cancelled=0&Pending=0&limit=1000`,
      {
        headers: { Authorization: `Bearer ${this.context.token}` }
      }
    );
  }

  retrieveCancelledRequests() {
    return axios.get(
      `../api/rooms/bookings/all?Approved=0&Rejected=0&Pending=0&limit=1000`,
      {
        headers: { Authorization: `Bearer ${this.context.token}` }
      }
    );
  }

  retrieveRemainingRequests() {
    return axios.get(
      `../api/rooms/bookings/all?Pending=0&limit=1000&sortOrder=-1`,
      {
        headers: { Authorization: `Bearer ${this.context.token}` }
      }
    );
  }

  retrieveAllRequests() {
    axios
      .all([this.retrievePendingRequests(), this.retrieveRemainingRequests()])
      .then(
        axios.spread((pendingRequestsResponse, remainingRequestsResponse) => {
          CONSOLE_LOGGING &&
            console.log(
              "GET pending booking requests:",
              pendingRequestsResponse
            );
          CONSOLE_LOGGING &&
            console.log(
              "GET remaining booking requests",
              remainingRequestsResponse
            );
          if (
            pendingRequestsResponse.status === 200 &&
            remainingRequestsResponse.status === 200
          ) {
            const allRequests = [
              ...pendingRequestsResponse.data.bookings,
              ...remainingRequestsResponse.data.bookings
            ];
            this.setState({
              allRequests,
              isLoading: false
            });
          }
        })
      )

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
    return (
      <div className="scrollable-table" style={{ maxHeight: "44em" }}>
        {this.state.allRequests.length > 0 ? (
          <div>
            <Dropdown
              fluid
              multiple
              search
              selection
              options={this.options}
              placeholder='Filter by status'
              renderLabel={this.renderLabel}
              onLabelClick={this.onLabelClick}
            />
            <Table
              selectable
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
          </div>
        ) : (
          <Segment
            placeholder
            textAlign="center"
            size="huge"
            loading={this.state.isLoading}
          >
            There are currently no booking requests
          </Segment>
        )}
      </div>
    );
  }
}

export default BookingsTable;
