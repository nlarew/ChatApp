import "./styles.css";
import "./typography.js";
import "./icons.js";
import React from "react";
import ReactDOM from "react-dom";
import { Helmet } from "react-helmet";
import { TypographyStyle, GoogleFont } from "react-typography";
import { handleOAuthRedirects } from "./stitch";
import ChatApp from "./components/ChatApp.js";

handleOAuthRedirects();
ReactDOM.render(<ChatApp />, document.getElementById("root"));
