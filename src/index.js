import "./styles.css";
import "./typography.js";
import "./icons.js";
import React from "react";
import ReactDOM from "react-dom";
import ChatApp from "./components/ChatApp.js";
import { app, handleOAuthRedirects } from "./stitch";

handleOAuthRedirects();
ReactDOM.render(<ChatApp />, document.getElementById("root"));
