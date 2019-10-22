import React from "react";
import { Context } from "../contexts/UserProvider";
import { Container, Button, Icon, Menu } from "semantic-ui-react";
import CreateAccountAdmin from "../components/CreateAccountAdmin";
import ReviewUsers from "../components/ReviewUsers";

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
        <br/>
        <Container>
          <h1>Booking requests</h1>
        </Container>
        <br/>
        <br/>
        <br/>
        <Container>
          <h1>Create accounts</h1>
          <CreateAccountAdmin />
        </Container>
        <br/>
        <br/>
        <br/>
        <Container>
          <h1>Review accounts</h1>
          <ReviewUsers/>
        </Container>
        <br/>
        <br/>
        <br/>
      </main>
    );
  }
}

export default AdminPage;
