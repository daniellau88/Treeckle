import React from "react";
import "./App.css";
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
    const { token, role } = this.context;

    return (
      <Router>
        {token !== "null" && <NavigationBar />}
        <Switch>
          <Route path="/" exact>
            {token !== "null" ? <Redirect to="/dashboard" /> : <LoginPage />}
          </Route>
          {token !== "null" && (
            <Route path="/dashboard" exact component={Dashboard} />
          )}
          {token !== "null" && (
            <Route path="/bookings" exact component={VenueBookingPage} />
          )}
          {token !== "null" && DEVELOPMENT_VIEW && (
            <Route path="/events" exact component={EventsPage} />
          )}
          {token !== "null" && role === "Admin" && (
            <Route path="/admin" exact component={AdminPage} />
          )}
          {token !== "null" && (
            <Route path="/profile" exact component={ProfilePage} />
          )}
          <Route
            path="/user/create/:uniqueId"
            component={CreateAccountUserPage}
          ></Route>
          <Route path="/user/create/" component={CreateAccountUserPage}></Route>
          <Route
            path="/auth/newAccounts/:uniqueId"
            component={RegisterFromEmailForm}
          ></Route>
          <Route
            path="/auth/resetAttempt/:uniqueId"
            component={ResetPasswordForm}
          ></Route>
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
