import React from "react";
import "./App.css";
import { Context } from "./contexts/UserProvider";
import { Route, Switch, Redirect } from "react-router-dom";
import ReactGA from "react-ga";
import NavigationBar from "./components/NavigationBar";
import Dashboard from "./pages/Dashboard";
// import AdminPage from "./pages/AdminPage";
import BookingsPage from "./pages/admin/BookingsPage";
import UsersPage from "./pages/admin/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import RoomsPage from "./pages/admin/RoomsPage";
import EventsPage from "./pages/EventsPage";
import VenueBookingPage from "./pages/VenueBookingPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import DirectAccountCreationPage from "./pages/auth/DirectAccountCreationPage";
import LinkAccountCreationPage from "./pages/auth/LinkAccountCreationPage";
import { DEVELOPMENT_VIEW } from "./DevelopmentView";
import CountsContextProvider from "./contexts/CountsProvider";

class App extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    ReactGA.initialize("UA-150749063-1");
  }

  render() {
    const { token, role } = this.context;
    return (
      <main>
        <CountsContextProvider>
          {token !== null && <NavigationBar />}
          <Switch>
            <Route path="/" exact>
              {token !== null ? <Redirect to="/dashboard" /> : <LoginPage />}
            </Route>
            {token !== null && (
              <Route path="/dashboard" exact component={Dashboard} />
            )}
            {token !== null && (
              <Route path="/bookings" exact component={VenueBookingPage} />
            )}
            {token !== null && DEVELOPMENT_VIEW && (
              <Route path="/events" exact component={EventsPage} />
            )}
            {/* {token !== null && role === "Admin" && (
            <Route path="/admin" exact component={AdminPage} />
          )} */}
            {token !== null && role === "Admin" && (
              <Route path="/admin/bookings" exact component={BookingsPage} />
            )}
            {token !== null && role === "Admin" && (
              <Route path="/admin/users" exact component={UsersPage} />
            )}
            {token !== null && role === "Admin" && (
              <Route path="/admin/settings" exact component={SettingsPage} />
            )}
            {token !== null && role === "Admin" && (
            <Route path="/admin/rooms" exact component={RoomsPage} />
            )}
            {token !== null && (
              <Route path="/profile" exact component={ProfilePage} />
            )}
            <Route path="/user/create" component={DirectAccountCreationPage} />
            <Route
              path="/auth/newAccounts/:uniqueId"
              component={LinkAccountCreationPage}
            />
            <Route
              path="/auth/resetAttempt/:uniqueId"
              component={ResetPasswordPage}
            />
            <Route>
              <Redirect to="/" />
            </Route>
          </Switch>
        </CountsContextProvider>
      </main>
    );
  }
}

export default App;
