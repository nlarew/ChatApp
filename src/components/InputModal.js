import React from "react";
import styled from "@emotion/styled";
import ModalCard from "./ModalCard";
import { useInput } from "react-hanger";
import { Modal } from "./useModal";

export default function InputModal({ handleSubmit, errorMessage, ...props }) {
  const inputRef = React.useRef();
  const focusInput = () => {
    if (props.isOpen) {
      inputRef.current && inputRef.current.focus();
    }
  };
  return (
    <Modal {...props}>
      <ModalCard heading="Create a New Room">
        <ActionInput
          id="newRoomInput"
          ref={inputRef}
          focusInput={focusInput}
          placeholder="Room Name"
          handleSubmit={handleSubmit}
          actionText="Create"
          hasError={Boolean(errorMessage)}
        />
        <ErrorLabel htmlFor="newRoomInput">{errorMessage}</ErrorLabel>
      </ModalCard>
    </Modal>
  );
}
const ActionInput = React.forwardRef(function(
  { placeholder, actionText, handleSubmit, focusInput, hasError },
  inputRef,
) {
  const input = useInput("");
  React.useEffect(focusInput);
  const handleKeyPress = e => {
    if (e.key === "Enter") {
      handleSubmit(input.value);
    }
  };
  return (
    <ActionInputLayout>
      <Input
        ref={ref => (inputRef.current = ref)}
        placeholder={placeholder}
        value={input.value}
        onChange={input.onChange}
        onKeyDown={handleKeyPress}
        hasError={hasError}
      />
      <ActionButton onClick={() => handleSubmit(input.value)}>
        {actionText}
      </ActionButton>
    </ActionInputLayout>
  );
});
const ActionInputLayout = styled.div`
  width: 100%;
  display: flex;
`;
const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  margin-right: 10px;
  border-radius: 4px;
  border: none;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
  background: ${props => props.hasError && "rgba(255, 0, 0, 0.25);"};
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
const ErrorLabel = styled.label`
  width: 100%;
  text-align: left;
  color: red;
`;
