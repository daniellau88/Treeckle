import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Dashboard from "./pages/Dashboard";
import EventsPage from "./pages/EventsPage";
import VenueBookingPage from "./pages/VenueBookingPage";
import ProfilePage from "./pages/ProfilePage";
import LoginForm from "./pages/authentication/Login";
import { UserProvider } from './context/UserContext'

export const Routes = () => {
  const [user, setUser] = useState();
  
  return (
    <div>
      <UserProvider value={{user, setUser}}>
        <NavigationBar />
        <Switch>
          <Route path="/dashboard" component={Dashboard}></Route>
          <Route path="/events" component={EventsPage}></Route>
          <Route path="/bookings" component={VenueBookingPage}></Route>
          <Route path="/profile" component={ProfilePage}></Route>
          <Route path="/login" component={LoginForm}></Route>
        </Switch>
      </UserProvider>
    </div>
  );
};
