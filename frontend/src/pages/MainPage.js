import React from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import NavigationBar from "../components/NavigationBar";
import Dashboard from "./Dashboard";
import EventsPage from "./EventsPage";
import VenueBookingPage from "./VenueBookingPage";
import ProfilePage from "./ProfilePage";

class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <main className="main-page">
        <NavigationBar />
        <Switch>
          <Route path="/dashboard" component={Dashboard}></Route>
          <Route path="/events" component={EventsPage}></Route>
          <Route path="/bookings" component={VenueBookingPage}></Route>
          <Route path="/profile" component={ProfilePage}></Route>
        </Switch>
      </main>
    );
  }
}

export default withRouter(MainPage);
