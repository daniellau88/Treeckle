import React from "react";
import Axios from "axios";
import ReactCollapsingTable from "react-collapsing-table";
import { Context } from "../../contexts/UserProvider";
import { Table } from "semantic-ui-react";
import StatusButton from "./StatusButton";
import { toDateTimeString } from "../../util/DateUtil";

const fields = [
  {
    accessor: "name",
    label: "Name",
    priorityLevel: 4,
    position: 1,
    minWidth: 150
  },
  {
    accessor: "email",
    label: "Email",
    priorityLevel: 7,
    position: 2,
    minWidth: 150
  },
  {
    accessor: "contactNum",
    label: "Contact number",
    priorityLevel: 8,
    position: 3,
    minWidth: 150
  },
  {
    accessor: "venue",
    label: "Venue",
    priorityLevel: 3,
    position: 4,
    minWidth: 150
  },
  {
    accessor: "start",
    label: "Start",
    priorityLevel: 5,
    position: 5,
    minWidth: 150
  },
  {
    accessor: "end",
    label: "End",
    priorityLevel: 6,
    position: 6,
    minWidth: 150
  },
  {
    accessor: "numParticipants",
    label: "Number of participants",
    priorityLevel: 9,
    position: 7,
    minWidth: 150
  },
  {
    accessor: "purpose",
    label: "Booking purpose",
    priorityLevel: 10,
    position: 8,
    minWidth: 150
  },
  {
    accessor: "createdDate",
    label: "Submitted at",
    priorityLevel: 2,
    position: 9,
    minWidth: 150
  },
  {
    accessor: "status",
    label: "Status",
    priorityLevel: 1,
    position: 10,
    CustomComponent: StatusButton,
    minWidth: 150
  }
];

const rows = [
  {
    id: 1,
    name: "Jeremy",
    email: "jeremytan97@u.nus.edu",
    contactNum: "81217370",
    venue: "Multi-Purpose Sports Hall",
    start: "25/12/2019 7.00 PM",
    end: "26/12/2019 11.00 AM",
    numParticipants: "20",
    purpose: "I want to play badminton",
    status: "booked"
  },
  {
    id: 2,
    name: "Jeremy",
    email: "jeremytan97@u.nus.edu",
    contactNum: "81217370",
    venue: "Multi-Purpose Sports Hall",
    start: "25/12/2019 7.00 PM",
    end: "26/12/2019 11.00 AM",
    numParticipants: "20",
    purpose: "I want to play badminton",
    status: "booked"
  },
  {
    id: 3,
    name: "Jeremy",
    email: "jeremytan97@u.nus.edu",
    contactNum: "81217370",
    venue: "Multi-Purpose Sports Hall",
    start: "25/12/2019 7.00 PM",
    end: "26/12/2019 11.00 AM",
    numParticipants: "20",
    purpose: "I want to play badminton",
    status: "booked"
  },
  {
    id: 4,
    name: "Jeremy dsdasdfdsfdsfsdfsdfsdasf",
    email: "jeremytan97@u.nus.edu",
    contactNum: "81217370",
    venue: "Multi-Purpose Sports Hall",
    start: "25/12/2019 7.00 PM",
    end: "26/12/2019 11.00 AM",
    numParticipants: "20",
    purpose: "I want to play badminton",
    status: "booked"
  }
];

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

    //this.renderBodyRow = this.renderBodyRow.bind(this);
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
            allRequests: this.renderRows(allRequests)
          });
        }
      )
    );
  }

  renderRows(allRequests) {
    return allRequests.map(request => {
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
      } = request;
      const status = approved;
      const [contactNum, numParticipants, purpose] = description.split("\n");
      console.log(status);
      return {
        name: createdByName,
        email: createdByEmail,
        contactNum: contactNum,
        venue: roomName,
        start: toDateTimeString(start),
        end: toDateTimeString(end),
        numParticipants: numParticipants,
        purpose: purpose,
        createdDate: toDateTimeString(createdDate),
        status: (
          <StatusButton
            status={status}
            cancellable={false}
            bookingId={bookingId}
            updateTable={this.retrieveAllRequests}
          />
        )
      };
    });
  }

  render() {
    return (
      <ReactCollapsingTable
        rows={this.state.allRequests}
        columns={fields}
        theme="table ui"
      />
    );
  }
}

export default BookingsTable;
/*
<Table
        fixed
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
      

      renderBodyRow(data, index) {
    console.log(data);
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
    const row = (
      <Table.Row>
        <Table.Cell>{createdByName}</Table.Cell>
        <Table.Cell>{createdByEmail}</Table.Cell>
        <Table.Cell>{roomName}</Table.Cell>
        <Table.Cell>{toDateTimeString(start)}</Table.Cell>
        <Table.Cell>{toDateTimeString(end)}</Table.Cell>
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
      */
