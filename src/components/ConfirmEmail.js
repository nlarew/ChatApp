import { confirmEmailPasswordUser } from "./../stitch";
import { toast } from "react-toastify";
import { navigate } from "@reach/router";

export default function ConfirmEmail() {
  const onSuccess = () => {
    const message = "Successfully confirmed your account! You can now log in.";
    toast(message, { type: toast.TYPE.SUCCESS });
    navigate("/");
  };
  const onFailure = err => {
    const message = `Failed to confirm your account - ${err.message}`;
    toast(message, { type: toast.TYPE.ERROR });
    navigate("/");
  };
  confirmEmailPasswordUser()
    .then(onSuccess)
    .catch(onFailure);
  return "Confirming Your Email/Password Account";
}
