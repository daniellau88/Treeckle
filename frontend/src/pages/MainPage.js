import React from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { Context } from "../contexts/UserProvider";
import NavigationBar from "../components/NavigationBar";
import Dashboard from "./Dashboard";
import EventsPage from "./EventsPage";
import VenueBookingPage from "./VenueBookingPage";
import ProfilePage from "./ProfilePage";
import AdminPage from "./AdminPage";

class MainPage extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <main className="main-page">
        <NavigationBar />
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/events" component={EventsPage} />
          <Route path="/bookings" component={VenueBookingPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/admin" component={AdminPage} />
        </Switch>
      </main>
    );
  }
}

export default withRouter(MainPage);
