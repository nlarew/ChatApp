import "./styles.css";
import "./typography.js";
import "./icons.js";
import React from "react";
import ReactDOM from "react-dom";
import ChatApp from "./components/ChatApp.js";
import { app, handleOAuthRedirects } from "./stitch";

console.log("pre-handleOAuthRedirects");
handleOAuthRedirects();
console.log(app.auth.listUsers());
// console.log("hrr", app.auth.hasRedirectResult());
console.log("post-handleOAuthRedirects");
ReactDOM.render(<ChatApp />, document.getElementById("root"));
