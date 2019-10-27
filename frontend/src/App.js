import React from "react";
import "./App.css";
import Axios from "axios";
import { Context } from "./contexts/UserProvider";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import ReactGA from "react-ga";
import NavigationBar from "./components/NavigationBar";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import EventsPage from "./pages/EventsPage";
import VenueBookingPage from "./pages/VenueBookingPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import ResetPasswordForm from "./pages/auth/ResetPassword";
import RegisterFromEmailForm from "./pages/auth/RegisterFromEmail";
import CreateAccountUserPage from "./pages/auth/CreateAccountUserPage";
import { DEVELOPMENT_VIEW } from "./DevelopmentView";

class App extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    ReactGA.initialize("UA-150749063-1");
  }

  render() {
    console.log(this.context);
    return (
      <Router>
        <NavigationBar />
        <Switch>
          <Route path="/" exact component={LoginPage} />
          <Route path="/dashboard" exact component={Dashboard} />
          <Route path="/bookings" exact component={VenueBookingPage} />

          <Route path="/events" exact component={EventsPage} />

          <Route path="/admin" exact component={AdminPage} />

          <Route path="/profile" exact component={ProfilePage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
