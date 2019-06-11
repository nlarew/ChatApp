import "./styles.css";
import "./typography.js";
import "./icons.js";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ChatApp from "./components/ChatApp.js";
import { Router, navigate } from "@reach/router";
import { confirmEmailPasswordUser } from "./stitch";
import { StitchAuthProvider } from "./components/StitchAuth";
import { ToastContainer, toast } from "react-toastify";

const ConfirmEmail = ({ onSuccess, onFailure }) => {
  confirmEmailPasswordUser().then(onSuccess, onFailure);
  return "Confirming Your Email/Password Account";
};

function App() {
  const [appErrorMessage, setAppErrorMessage] = useState(null);
  const [appSuccessMessage, setAppSuccessMessage] = useState(null);

  useEffect(() => {
    if (appErrorMessage) {
      toast.error("🦄 Wow so easy!", {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => setAppErrorMessage(null),
      });
    }
  }, [appErrorMessage]);

  useEffect(() => {
    if (appSuccessMessage) {
      toast.success("🦄 Wow so easy!", {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => setAppSuccessMessage(null),
      });
    }
  }, [appSuccessMessage]);

  return (
    <StitchAuthProvider>
      <Router>
        <ConfirmEmail
          path="/confirmEmail"
          onSuccess={() => {
            setAppSuccessMessage("Successfully confirmed your account!");
            navigate("/");
          }}
          onFailure={err => {
            setAppErrorMessage(
              `Failed to confirm your account - ${err.message}`,
            );
            navigate("/");
          }}
        />
        <ChatApp
          appSuccessMessage={appSuccessMessage}
          setAppSuccessMessage={setAppSuccessMessage}
          appErrorMessage={appErrorMessage}
          setAppErrorMessage={setAppErrorMessage}
          default
        />
      </Router>
    </StitchAuthProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
