import "./styles.css";
import "react-toastify/dist/ReactToastify.css";
import "./typography.js";
import "./icons.js";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ChatApp from "./components/ChatApp.js";
import { Router, navigate } from "@reach/router";
import { confirmEmailPasswordUser } from "./stitch";
import { StitchAuthProvider } from "./components/StitchAuth";
import { toast } from "react-toastify";

const ConfirmEmail = ({ onSuccess, onFailure }) => {
  confirmEmailPasswordUser().then(onSuccess, onFailure);
  return "Confirming Your Email/Password Account";
};

function useAppMessage(initialMessage, options = {}) {
  const { shouldToast = true, toastStyle = toast.TYPE.DEFAULT } = options;
  const [appMessage, setAppMessage] = useState(initialMessage || null);

  useEffect(() => {
    if (shouldToast && appMessage) {
      toast(appMessage, {
        type: toastStyle,
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => setAppMessage(null),
      });
    }
  }, [shouldToast, appMessage, toastStyle]);

  return setAppMessage;
}

function App() {
  const setAppErrorMessage = useAppMessage(null, {
    toastStyle: toast.TYPE.ERROR,
  });
  const setAppSuccessMessage = useAppMessage(null, {
    toastStyle: toast.TYPE.SUCCESS,
  });

  return (
    <StitchAuthProvider>
      <Router>
        <ConfirmEmail
          path="/confirmEmail"
          onSuccess={() => {
            setAppSuccessMessage(
              "Successfully confirmed your account! You can now log in.",
            );
            navigate("/");
          }}
          onFailure={err => {
            setAppErrorMessage(
              `Failed to confirm your account - ${err.message}`,
            );
            navigate("/");
          }}
        />
        <ChatApp default />
      </Router>
    </StitchAuthProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
