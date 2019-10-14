import React from "react";
import { Route, Switch } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Dashboard from "./pages/Dashboard";
import EventsPage from "./pages/EventsPage";
import VenueBookingPage from "./pages/VenueBookingPage";
import ProfilePage from "./pages/ProfilePage";
import LoginForm from "./pages/authentication/Login"
import CreateAccountAdminPage from "./pages/authentication/CreateAccountAdminPage";
import CreateAccountUserPage from "./pages/authentication/CreateAccountUserPage";

export const Routes = () => {
  return (
    <div>
      <NavigationBar />
      <Switch>
        <Route exact path="/" component={LoginForm} />
        <Route path="/dashboard" component={Dashboard}></Route>
        <Route path="/events" component={EventsPage}></Route>
        <Route path="/bookings" component={VenueBookingPage}></Route>
        <Route path="/profile" component={ProfilePage}></Route>
        <Route path="/admin/create" component={CreateAccountAdminPage}></Route>
        <Route path="/user/create/:uniqueId" component={CreateAccountUserPage}></Route>
      </Switch>
    </div>
  );
};
