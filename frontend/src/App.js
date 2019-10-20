import React, { useContext } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import UserProvider, { Context } from "./contexts/UserProvider";
import { Routes } from "./routes"; // where we are going to specify our routes

function App() {
  const contextValue = useContext(Context);

  let token = contextValue.token;
  let name = contextValue.name;
  let profilePic = contextValue.profilePic;
  let role = contextValue.role;

  if (contextValue.token !== -1 && contextValue.token !== -2) {
    token = localStorage.getItem("token");
    name = localStorage.getItem("name");
    profilePic = localStorage.getItem("profilePic");
    role = localStorage.getItem("role");
  }

  token = token === null ? "" : token;
  name = name === null ? "" : name;
  profilePic = profilePic === null ? "" : profilePic;
  role = role === null ? "" : role;

  React.useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    localStorage.setItem("profilePic", profilePic);
    localStorage.setItem("role", role);
    if (contextValue.token !== -1 && contextValue.token !== -2) {
      contextValue.setUser(token, name, profilePic, role);
      //console.log("Updated!", contextValue);
    }
  }, []);

  return (
    <UserProvider>
      <Context.Consumer>
        {(token, name, profilePic, role) => (
          <Router>
            <Routes />
          </Router>
        )}
      </Context.Consumer>
    </UserProvider>
  );
}

export default App;
