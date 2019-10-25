import React from "react";
import axios from "axios";
import { Placeholder, Table } from "semantic-ui-react";
import { Context } from "../contexts/UserProvider";
import ChangeRoleButton from "./buttons/ChangeRoleButton";
import DeleteUserButton from "./buttons/DeleteUserButton";

class UserAccountsTable extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      allAccounts: [],
      createdAccounts: [],
      pendingAccounts: [],
      isLoading: true
    };

    this.renderBodyRow = this.renderBodyRow.bind(this);
    this.retrieveAccounts = this.retrieveAccounts.bind(this);
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
          const allAccounts = [...createdAccounts, ...pendingAccounts];
          this.setState({
            allAccounts,
            createdAccounts,
            pendingAccounts,
            isLoading: false
          });
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
    const { name, email, role } = data;
    const row = (
      <Table.Row>
        <Table.Cell>{name ? name : "<Pending registration>"}</Table.Cell>
        <Table.Cell>{email}</Table.Cell>
        <Table.Cell>{role}</Table.Cell>
        <Table.Cell textAlign="right">
          <ChangeRoleButton
            name={name}
            email={email}
            updateTable={this.retrieveAccounts}
          />
          <DeleteUserButton email={email} updateTable={this.retrieveAccounts} />
        </Table.Cell>
      </Table.Row>
    );
    return row;
  }

  render() {
    return this.state.isLoading ? (
      <Table>
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
      </Table>
    ) : (
      <Table
        fixed
        headerRow={
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">Actions</Table.HeaderCell>
          </Table.Row>
        }
        renderBodyRow={this.renderBodyRow}
        tableData={this.state.allAccounts}
      />
    );
  }
}

export default UserAccountsTable;
