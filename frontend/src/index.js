import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
// import "semantic-ui-css/semantic.css"; //for @rohan-av to test themeing
// import "semantic-ui-css/semantic.min.css";
import "semantic-ui-less/semantic.less";
import UserProvider, { Context } from "./contexts/UserProvider";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <Router>
    <UserProvider>
      <Context.Consumer>
        {(token, name, profilePic, role, setUser, resetUser) => {
          return <App />;
        }}
      </Context.Consumer>
    </UserProvider>
  </Router>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
