import React from "react";
import ReactDOM from "react-dom";
import ChatRoom from "./components/ChatRoom.js";
import "./styles.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

library.add(faPaperPlane);

const rootElement = document.getElementById("root");
ReactDOM.render(<ChatRoom />, rootElement);
