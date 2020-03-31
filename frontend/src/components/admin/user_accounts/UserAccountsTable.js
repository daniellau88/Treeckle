import React from "react";
import axios from "axios";
import { Placeholder, Table } from "semantic-ui-react";
import { Context } from "../../../contexts/UserProvider";
import ChangeRoleButton from "./ChangeRoleButton";
import DeleteUserButton from "./DeleteUserButton";
import UserEmailChanger from "./UserEmailChanger";
import { CONSOLE_LOGGING } from "../../../DevelopmentView";
import "../../../styles/ScrollableTable.scss";

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
    axios
      .get("../api/accounts", {
        headers: { Authorization: `Bearer ${this.context.token}` }
      })
      .then(response => {
        CONSOLE_LOGGING && console.log("GET all accounts:", response);
        if (response.status === 200) {
          this.setState({
            allAccounts: response.data,
            isLoading: false
          });
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING && console.log("GET all accounts error:", response);
        switch (response.status) {
          case 401:
            alert("Your current session has expired. Please log in again.");
            this.context.resetUser();
            break;
          default:
            alert("An unknown error has occurred. Please log try again.");
        }
      });
  }

  renderBodyRow(data, index) {
    const { name, email, role } = data;
    const row = (
      <Table.Row key={email}>
        <Table.Cell>{name ? name : "<Pending registration>"}</Table.Cell>
        <Table.Cell>
          <UserEmailChanger email={email} updateTable={this.retrieveAccounts} />
        </Table.Cell>
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
    return (
      <div className="scrollable-table" style={{ maxHeight: "37em" }}>
        {this.state.isLoading ? (
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
            selectable
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
        )}
      </div>
    );
  }
}

export default UserAccountsTable;
