import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Navigation from "./Navigation";

function App() {
  return (
    <Router>
      <Navigation />
    </Router>
  );
}

export default App;
