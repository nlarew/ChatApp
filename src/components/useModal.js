import { useState } from "react";
import ReactModal from "react-modal";
import styled from "@emotion/styled";

export default function useModal(label) {
  const [isOpen, setIsOpen] = useState(false);
  const actions = {
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(!isOpen),
  };
  const props = {
    isOpen,
    onRequestClose: actions.close,
    contentLabel: label,
    style: { overlay: { background: "rgba(0,0,0,0.75)" } },
    shouldFocusAfterRender: false,
    appElement: document.getElementById("root"),
  };
  return [props, isOpen, actions];
}
export const Modal = styled(ReactModal)`
  width: 20vw;
  min-width: 400px;
  margin: 15vh auto;
`;
