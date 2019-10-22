import React from "react";
import Axios from "axios";
import { Context } from "../contexts/UserProvider";
import { Container, Button, Menu, Table, Popup } from "semantic-ui-react";
import { toDateTimeString } from "../util/DateUtil";

class AdminPage extends React.Component {
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

  // 0 => pending, 1 => approved, 2 => rejected, 3 => cancelled
  renderStatusButton(status) {
    var color;
    var status;

    switch (status) {
      case 0:
        color = "orange";
        status = "Pending";
        break;
      case 1:
        color = "green";
        status = "Approved";
        break;
      case 2:
        color = "red";
        status = "Rejected";
        break;
      case 3:
        color = "black";
        status = "Cancelled";
        break;
      default:
        color = "standard";
        status = "Unknown";
    }

    return <Button basic color={color} content={status} />;
  }

  renderBodyRow(data, index) {
    const {
      createdByName,
      createdByEmail,
      start,
      end,
      description,
      createdDate,
      approved
    } = data;
    const status = approved;
    const row = (
      <Table.Row>
        <Table.Cell>{createdByName}</Table.Cell>
        <Table.Cell>{createdByEmail}</Table.Cell>
        <Table.Cell>Venue</Table.Cell>
        <Table.Cell>{toDateTimeString(start)}</Table.Cell>
        <Table.Cell>{toDateTimeString(end)}</Table.Cell>
        <Table.Cell>{description}</Table.Cell>
        <Table.Cell>{toDateTimeString(createdDate)}</Table.Cell>
        <Table.Cell>
          <Popup
            trigger={this.renderStatusButton(status)}
            on="click"
            content={<Button color="red" icon="cancel" />}
            position="right center"
          />
        </Table.Cell>
      </Table.Row>
    );
    return row;
  }

  render() {
    return (
      <main className="admin-page">
        <Menu size="huge"></Menu>
        <br />
        <Container>
          <h1>Booking requests</h1>
          <Table
            headerRow={
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Venue</Table.HeaderCell>
                <Table.HeaderCell>Start</Table.HeaderCell>
                <Table.HeaderCell>End</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Submitted at</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
              </Table.Row>
            }
            tableData={this.state.allRequests}
            renderBodyRow={this.renderBodyRow}
          />
        </Container>
      </main>
    );
  }
}

export default AdminPage;
