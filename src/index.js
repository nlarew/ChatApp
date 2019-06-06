import "./styles.css";
import "./typography.js";
import "./icons.js";
import React from "react";
import ReactDOM from "react-dom";
import { handleOAuthRedirects } from "./stitch";
import ChatApp from "./components/ChatApp.js";

handleOAuthRedirects();

ReactDOM.render(<ChatApp />, document.getElementById("root"));
