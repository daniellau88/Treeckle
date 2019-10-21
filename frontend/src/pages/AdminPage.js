import React from "react";
import { Context } from "../contexts/UserProvider";
import { Container, Button, Icon, Menu } from "semantic-ui-react";

class AdminPage extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <main className="admin-page">
        <Menu size="huge"></Menu>
        <br />
        <Container>
          <h1>Booking requests</h1>
        </Container>
      </main>
    );
  }
}

export default AdminPage;
