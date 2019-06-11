import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import ModalCard from "./ModalCard";
import useControlledInput from "./useControlledInput";
import { Modal } from "./useModal";
import { toast } from "react-toastify";
import {
  loginEmailPassword,
  registerEmailPasswordUser,
  resendConfirmationEmail,
} from "./../stitch";
import validator from "validator";

export default React.memo(function EmailPasswordLoginModal(props) {
  const [authenticationError, setAuthenticationError] = useState(null);

  const [emailInputError, setEmailInputError] = useState(null);
  const [emailInput, emailInputRef] = useControlledInput("", {
    shouldFocusInput: props.isOpen,
    shouldClearInput: !props.isOpen,
  });
  const [passwordInputError, setPasswordInputError] = useState(null);
  const [passwordInput, passwordInputRef] = useControlledInput("", {
    shouldFocusInput: props.isOpen,
    shouldClearInput: !props.isOpen,
  });

  const validateEmail = () => {
    const isValid = validator.isEmail(emailInput.value);
    if (isValid) {
      setEmailInputError("");
    } else {
      setEmailInputError("Please enter a valid email address");
    }
    return isValid;
  };
  const validatePassword = () => {
    const isValid = validator.isLength(passwordInput.value, {
      min: 6,
      max: 128,
    });
    if (isValid) {
      setPasswordInputError("");
    } else {
      setPasswordInputError(
        "Please enter a password between 6 and 128 characters",
      );
    }
    return isValid;
  };

  const handleLogin = async () => {
    setAuthenticationError(null);
    const emailIsValid = validateEmail();
    const passwordIsValid = validatePassword();
    if (emailIsValid && passwordIsValid) {
      loginEmailPassword(emailInput.value, passwordInput.value).catch(err => {
        const invalidEmailOrPassword = /invalid username\/password/.test(
          err.message,
        );
        if (invalidEmailOrPassword)
          setAuthenticationError("Invalid Email or Password.");
      });
    }
  };
  const handleRegistration = async () => {
    setAuthenticationError(null);
    const emailIsValid = validateEmail();
    const passwordIsValid = validatePassword();
    if (emailIsValid && passwordIsValid) {
      const toastSuccessfulRegistration = () => {
        toast(`Sent a registration email to ${emailInput.value}`, {
          type: toast.TYPE.SUCCESS,
        });
      };
      const handleUnsuccessfulRegistration = async err => {
        const nameAlreadyInUse = /name already in use/.test(err.message);
        try {
          await resendConfirmationEmail(emailInput.value);
          toastSuccessfulRegistration();
        } catch (error) {
          const alreadyConfirmed = /already confirmed/.test(err.message);
          if (alreadyConfirmed) setEmailInputError("Email is already in use.");
        }
      };
      registerEmailPasswordUser(emailInput.value, passwordInput.value)
        .then(toastSuccessfulRegistration)
        .catch(handleUnsuccessfulRegistration);
    }
  };

  return (
    <Modal {...props}>
      <ModalCard heading="Email/Password">
        <ErrorText>{authenticationError}</ErrorText>
        <InputGroup>
          <FieldLabel htmlFor="emailAddressInput">Email Address</FieldLabel>
          <Input
            id="emailAddressInput"
            ref={emailInputRef}
            input={emailInput}
            type="email"
            placeholder="joe.schmoe@example.com"
            hasError={Boolean(emailInputError)}
          />
          <ErrorLabel htmlFor="emailAddressInput">{emailInputError}</ErrorLabel>
        </InputGroup>
        <InputGroup>
          <FieldLabel htmlFor="passwordInput">Password</FieldLabel>
          <Input
            id="passwordInput"
            ref={passwordInputRef}
            input={passwordInput}
            type="password"
            placeholder="SuperSecretPassw0rd"
            hasError={Boolean(passwordInputError)}
          />
          <ErrorLabel htmlFor="passwordInput">{passwordInputError}</ErrorLabel>
        </InputGroup>
        <ButtonGroup>
          <ActionButton onClick={handleRegistration}>Register</ActionButton>
          <ActionButton onClick={handleLogin}>Log In</ActionButton>
        </ButtonGroup>
      </ModalCard>
    </Modal>
  );
});

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const ActionButton = styled.button`
  padding: 8px 10px;
  border-radius: 4px;
  line-height: 16px;
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: grey;
  color: ${props => props.color || "white"};
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;

const Input = React.forwardRef(function(
  { placeholder, input, ...props },
  inputRef,
) {
  return (
    <InputElement
      ref={ref => (inputRef.current = ref)}
      value={input.value}
      onChange={input.onChange}
      placeholder={placeholder}
      {...props}
    />
  );
});
const InputGroup = styled.div`
  width: 100%;
  margin: 0 0 20px 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;
const InputElement = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: none;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
  background: ${props => props.hasError && "rgba(255, 0, 0, 0.25);"};
`;
const FieldLabel = styled.label`
  width: 100%;
  text-align: left;
  font-weight: bold;
  font-size: 1.15rem;
`;
const ErrorLabel = styled.label`
  width: 100%;
  text-align: left;
  color: red;
`;
const ErrorText = styled.span`
  width: 100%;
  text-align: center;
  color: red;
  font-size: 1.15rem;
`;
