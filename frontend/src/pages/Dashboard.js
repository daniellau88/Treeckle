import React from "react";
import { Menu } from "semantic-ui-react";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <main className="dashboard">
        <Menu size="huge"></Menu>
        <br />
        <div className="placeholder">This is the dashboard.</div>
      </main>
    );
  }
}

export default Dashboard;
