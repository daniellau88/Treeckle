import React from "react";
import Axios from "axios";
import { Placeholder, Table } from "semantic-ui-react";
import { Context } from "../../../contexts/UserProvider";
import ChangeRoleButton from "./ChangeRoleButton";
import DeleteUserButton from "./DeleteUserButton";
import { CONSOLE_LOGGING } from "../../../DevelopmentView";

class UserAccountsTable extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      allAccounts: [],
      isLoading: true
    };

    this.renderBodyRow = this.renderBodyRow.bind(this);
    this.retrieveAccounts = this.retrieveAccounts.bind(this);
  }

  componentDidMount() {
    this.retrieveAccounts();
  }

  retrieveAccounts() {
    Axios.get("api/accounts", {
      headers: { Authorization: `Bearer ${this.context.token}` }
    }).then(response => {
      CONSOLE_LOGGING && console.log("GET all accounts", response);
      if (response.status === 200) {
        this.setState({
          allAccounts: response.data,
          isLoading: false
        });
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
            role={role}
          />
          <DeleteUserButton email={email} updateTable={this.retrieveAccounts} />
        </Table.Cell>
      </Table.Row>
    );
    return row;
  }

  render() {
    return this.state.isLoading ? (
      <Table style={{ boxShadow: "2px 2px 10px 0 rgba(34,36,38,.85)" }}>
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
        style={{ boxShadow: "2px 2px 10px 0 rgba(34,36,38,.85)" }}
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
