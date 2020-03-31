import React from "react";
import ReactGA from "react-ga";
import { Context } from "../../contexts/UserProvider";
import { Container, Menu } from "semantic-ui-react";
import AdminConfig from "../../components/admin/config/AdminConfig";

class SettingsPage extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    ReactGA.pageview("/admin/settings");
  }

  render() {
    return (
      <main className="admin-settings-page">
        <Menu size="huge" style={{ opacity: 0 }}></Menu>
        <br />
        <br />
        <Container>
          <h1 style={{ color: "#FDFDFD" }}>Configure CC Email</h1>
          <AdminConfig />
        </Container>
        <br />
        <br />
        <br />
      </main>
    );
  }
}

export default SettingsPage;
