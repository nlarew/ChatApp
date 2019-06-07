import React from "react";
import styled from "@emotion/styled";
import ModalCard from "./ModalCard";
import { useInput } from "react-hanger";

export default function InputModalCard({ handleSubmit }) {
  return (
    <ModalCard heading="Create a New Room">
      <ActionInput
        placeholder="Room Name"
        handleSubmit={handleSubmit}
        actionText="Create"
      />
    </ModalCard>
  );
}

const ActionInput = function({ placeholder, actionText, handleSubmit }) {
  const input = useInput("");
  return (
    <ActionInputLayout>
      <Input
        placeholder={placeholder}
        value={input.value}
        onChange={input.onChange}
      />
      <button onClick={() => handleSubmit(input.value)}>{actionText}</button>
    </ActionInputLayout>
  );
};
const ActionInputLayout = styled.div`
  width: 80%;
  display: flex;
  margin-bottom: 26px;
`;
const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
`;
