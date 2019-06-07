import React, { useState } from "react";
import ReactModal from "react-modal";
import styled from "@emotion/styled";

export default function useModal(label) {
  const [isOpen, setIsOpen] = useState(false);
  const actions = {
    openModal: () => setIsOpen(true),
    closeModal: () => setIsOpen(false),
  };
  const Modal = props => (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={actions.closeModal}
      contentLabel={label}
      style={{ overlay: { background: "rgba(0,0,0,0.75)" } }}
      shouldFocusAfterRender={false}
      appElement={document.getElementById("root")}
      {...props}
    />
  );
  return [Modal, isOpen, actions];
}
const StyledModal = styled(ReactModal)`
  width: 20vw;
  min-width: 400px;
  margin: 15vh auto;
`;
