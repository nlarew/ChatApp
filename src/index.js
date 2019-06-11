import "react-toastify/dist/ReactToastify.css";
import "./styles.css";
import "./typography.js";
import "./icons.js";
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "@reach/router";
import { StitchAuthProvider } from "./components/StitchAuth";
import ChatApp from "./components/ChatApp.js";
import ConfirmEmail from "./components/ConfirmEmail";

function App() {
  return (
    <StitchAuthProvider>
      <Router>
        <ConfirmEmail path="/confirmEmail" />
        <ChatApp default />
      </Router>
    </StitchAuthProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
