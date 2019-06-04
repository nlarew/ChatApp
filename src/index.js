import React from "react";
import ReactDOM from "react-dom";
import ChatRoom from "./components/ChatRoom.js";
import "./styles.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { handleOAuthRedirects } from "./stitch";
import { StitchAuthProvider, useStitchAuth } from "./components/StitchAuth";
import LoginScreen from "./components/LoginScreen.js";

handleOAuthRedirects();

const rootElement = document.getElementById("root");
library.add(faPaperPlane);

const RequireLogin = props => {
  const { isLoggedIn } = useStitchAuth();
  return isLoggedIn ? props.children : <LoginScreen />;
};

const App = () => (
  <StitchAuthProvider>
    <RequireLogin>
      <ChatRoom />
    </RequireLogin>
  </StitchAuthProvider>
);

ReactDOM.render(<App />, rootElement);
