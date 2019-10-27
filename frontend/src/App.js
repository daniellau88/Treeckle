import React from "react";
import "./App.css";
import { Context } from "./contexts/UserProvider";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ReactGA from "react-ga";
import NavigationBar from "./components/NavigationBar";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import EventsPage from "./pages/EventsPage";
import VenueBookingPage from "./pages/VenueBookingPage";
import ProfilePage from "./pages/ProfilePage";
import LoginForm from "./pages/authentication/Login";
import ForgotPasswordForm from "./pages/authentication/ForgotPassword";
import ResetPasswordForm from "./pages/authentication/ResetPassword";
import RegisterFromEmailForm from "./pages/authentication/RegisterFromEmail";
import CreateAccountUserPage from "./pages/authentication/CreateAccountUserPage";
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
          <Route path="/dashboard" exact component={Dashboard} />
          <Route path="/bookings" exact component={VenueBookingPage} />
          <Route path="/events" exact component={EventsPage} />
          <Route path="/admin" exact component={AdminPage} />
          <Route path="/profile" exact component={ProfilePage} />
          <Route path="/" exact component={LoginForm} />
        </Switch>
      </Router>
    );
  }
}

export default App;
