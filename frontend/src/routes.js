import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { Context } from "./contexts/UserProvider";
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

function notNull(param) {
  return param !== null && param !== "";
}

export const Routes = () => {
  const contextValue = useContext(Context);

  let token = contextValue.token;
  let name = contextValue.name;
  let profilePic = contextValue.profilePic;
  let role = contextValue.role;

  if (notNull(token)) {
    localStorage.setItem("token", token);
  } else {
    token = localStorage.getItem("token");
  }
  if (notNull(name)) {
    localStorage.setItem("name", name);
  } else {
    name = localStorage.getItem("name");
  }
  if (notNull(profilePic)) {
    localStorage.setItem("profilePic", JSON.stringify(profilePic));
  } else {
    profilePic =
      localStorage.getItem("profilePic") === null ||
      localStorage.getItem("profilePic") === ""
        ? null
        : JSON.parse(localStorage.getItem("profilePic"));
  }
  if (notNull(role)) {
    localStorage.setItem("role", role);
  } else {
    role = localStorage.getItem("role");
  }

  return (
    <div>
      {token !== "" && token !== -1 && token !== -2 && <NavigationBar />}
      {token !== "" && token !== -1 && token !== -2 && (
        <Route path="/dashboard" component={Dashboard}></Route>
      )}
      {token !== "" && token !== -1 && token !== -2 && DEVELOPMENT_VIEW && (
        <Route path="/events" component={EventsPage}></Route>
      )}
      {token !== "" && token !== -1 && token !== -2 && (
        <Route path="/bookings" component={VenueBookingPage}></Route>
      )}
      {token !== "" && token !== -1 && token !== -2 && (
        <Route path="/profile" component={ProfilePage}></Route>
      )}
      {token !== "" && token !== -1 && token !== -2 && role === "Admin" && (
        <Route path="/admin" component={AdminPage}></Route>
      )}
      {token === "" && <Route exact path="/" component={LoginForm} />}
      {/* {token === -1 && (
        <Route exact path="/" component={} />
      )} */}
      {token === -2 && <Route exact path="/" component={ForgotPasswordForm} />}
      {/* {
        <Route
          path="/auth/emailRedirect/:uniqueId"
          component={PasswordReset}
        />
      } */}

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
      {token !== "" &&
        token !== -1 &&
        token !== -2 &&
        token !== null &&
        window.location.pathname === "/" && <Redirect to={"/dashboard"} />}
      {token === null &&
        window.location.pathname !== "/" &&
        window.location.pathname !== "/user/create" &&
        (window.location.pathname.slice(0, 17) !== "/auth/newAccounts" ||
          window.location.pathname.length < 19) &&
        (window.location.pathname.slice(0, 18) !== "/auth/resetAttempt" ||
          window.location.pathname.length < 20) && <Redirect to={"/"} />}
    </div>
  );
};
