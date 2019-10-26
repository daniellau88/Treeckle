import React from "react";
import { Context } from "../contexts/UserProvider";
import { Menu, Container } from "semantic-ui-react";

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
        <br />
        <Container style={{ color: "#FDFDFD" }}>
          <h1>Welcome, {this.context.name}</h1>
          <h2>Head over to the "Bookings" tab to view/make bookings.</h2>
          <text>
            <strong>Note:</strong> Treeckle is currently in development as part
            of a ​
            <u>
              <strong>
                <a href="https://www.cs3216.com" style={{ color: "#FDFDFD" }}>
                  CS3216
                </a>
              </strong>
            </u>{" "}
            Final Project, and we are working hard towards making residential
            life better for you. If you have feedback for us and/or would like
            to have your voice heard in the future of this application, please
            feel free to drop us an email at ​
            <u>
              <strong>
                <a
                  href="mailto:admin@treeckle.com"
                  style={{ color: "#FDFDFD" }}
                >
                  admin@treeckle.com
                </a>
              </strong>
            </u>
            .
          </text>
        </Container>
      </main>
    );
  }
}

export default Dashboard;
