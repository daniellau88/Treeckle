import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
// import "semantic-ui-css/semantic.css"; //for @rohan-av to test themeing
import "semantic-ui-css/semantic.min.css";
import UserProvider, { Context } from "./contexts/UserProvider";

ReactDOM.render(
  <UserProvider>
    <Context.Consumer>
      {(token, name, profilePic, role, setUser) => {
        return <App />;
      }}
    </Context.Consumer>
  </UserProvider>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
