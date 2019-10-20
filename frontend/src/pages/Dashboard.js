import React from "react";
import { Context } from "../contexts/UserProvider";
import { Menu } from "semantic-ui-react";

class Dashboard extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <main className="dashboard">
        <Menu size="huge"></Menu>
        <br />
        <div className="placeholder">Welcome, {this.context.name}.</div>
      </main>
    );
  }
}

export default Dashboard;
