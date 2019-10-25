import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Popup, Button, Placeholder, Table } from "semantic-ui-react";
import { Context } from "../contexts/UserProvider";
import UserActionButton from "./UserActionButton";

class ReviewUsers extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      createdAccounts: [],
      pendingAccounts: [],
      loading: true
    };

    this.renderBodyRow = this.renderBodyRow.bind(this);
    this.retrieveAllRequests = this.retrieveAllRequests.bind(this);
  }

  componentDidMount() {
    this.retrieveAccounts();
  }

  retrieveAccounts() {
    axios
      .get("api/accounts", {
        headers: { Authorization: `Bearer ${this.context.token}` }
      })
      .then(response => {
        console.log("GET all accounts", response);
        if (response.status === 200) {
          const { createdAccounts, pendingAccounts } = response.data;
          this.setState({ createdAccounts, pendingAccounts, loading: false });
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
      name, email, role
    } = data;
    const row = (
      <Table.Row>
        <Table.Cell>{name ? name : "<Pending registration>"}</Table.Cell>
        <Table.Cell>{email}</Table.Cell>
        <Table.Cell>{role}</Table.Cell>
        <Table.Cell textAlign="right">
        <UserActionButton/>
        
        </Table.Cell>
      </Table.Row>
    );
    return row;
  }

  render() {
      return (
        <Table fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
  
        <Table.Body>
          {createdAccounts.map((value, index) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>{value.name}</Table.Cell>
                <Table.Cell>{value.email}</Table.Cell>
                <Table.Cell>{value.role}</Table.Cell>
                <Table.Cell textAlign="right">
                  
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      )
  }
}

const ReviewUsers = props => {
  const user = useContext(Context);

  const [createdAccounts, setCreatedAccounts] = useState(null);
  const [pendingAccounts, setPendingAccounts] = useState(null);
  const [loading, setLoading] = useState(true);

  const headers = {
    Authorization: `Bearer ${user.token}`
  };

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get("/api/accounts", { headers: headers })
        .then(res => {
          if (res.status === 200) {
            setCreatedAccounts(res.data.createdAccounts);
            setPendingAccounts(res.data.pendingAccounts);
            console.log(res.data);
            setLoading(false);
          }
        })
        .catch(err => {
          console.log(err);
        });
    };
    fetchData();
  }, []);

  const deleteUser = email => {
    console.log("deleting " + email);
    axios
      .delete(
        "/api/accounts",
        {
          email: email
        },
        { headers: headers }
      )
      .then(res => {
        if (res.status === 200) {
          console.log("deleted");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const makeOrganiser = person => {
    console.log("changing " + person);
    axios
      .patch(
        "/api/accounts",
        {
          name: person.name,
          email: person.email,
          role: "Organiser"
        },
        { headers: headers }
      )
      .then(res => {
        if (res.status === 200) {
          console.log("changed Role");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const makeResident = person => {
    console.log("changing " + person);
    axios
      .patch(
        "/api/accounts",
        {
          name: person.name,
          email: person.email,
          role: "Resident"
        },
        { headers: headers }
      )
      .then(res => {
        if (res.status === 200) {
          console.log("changed Role");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  if (loading) {
    return (
      <Table fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Placeholder>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Paragraph>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Paragraph>
              </Placeholder>
            </Table.Cell>
            <Table.Cell>
              <Placeholder>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Paragraph>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Paragraph>
              </Placeholder>
            </Table.Cell>
            <Table.Cell>
              <Placeholder>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Paragraph>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Paragraph>
              </Placeholder>
            </Table.Cell>
            <Table.Cell>
              <Placeholder>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Paragraph>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Paragraph>
              </Placeholder>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }

  return (
    
  );
};

export default ReviewUsers;
