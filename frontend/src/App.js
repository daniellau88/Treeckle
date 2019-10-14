import React, { useContext } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Context } from "./contexts/UserProvider";
import { Routes } from "./routes"; // where we are going to specify our routes

function App() {
  const contextValue = useContext(Context);

  let token = contextValue.token;
  let name = contextValue.name;
  let profilePic = contextValue.profilePic;

  token = token === null ? "" : token;
  name = name === null ? "" : name;
  profilePic = profilePic === null ? "" : profilePic;

  React.useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    localStorage.setItem("profilePic", profilePic);
    if (contextValue.user !== -1 && contextValue.user !== -2) {
      contextValue.setUser(token, name, profilePic);
    }
  }, []);

  return (
    <Context.Consumer>
      {(token, name, profilePic) => (
        <Router>
          <Routes />
        </Router>
      )}
    </Context.Consumer>
  );
}

export default App;
