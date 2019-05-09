/** @jsx jsx */
import React, { useRef, useState, useEffect } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import Textarea from "react-textarea-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const SendIcon = () => <FontAwesomeIcon icon={faPaperPlane} />;

export default function ChatBar(props) {
  const { sendMessage, setMessageText, messageText } = props;
  const handleMessageSend = () => {
    sendMessage(messageText);
    setMessageText("");
  };
  const handleInput = e => {
    setMessageText(e.target.value);
  };
  return (
    <ChatBarLayout>
      <ChatBarInput type="text" value={messageText} onChange={handleInput} />
      <ChatBarButton onClick={handleMessageSend} />
    </ChatBarLayout>
  );
}
const ChatBarLayout = styled.div`
  width: 100%;
  min-height: 52px;
  background-color: lightgray;
  display: flex;
  flex-direction: row;
  // align-items: center;
  padding: 12px 12px;
  box-sizing: border-box;
  flex-grow: 0;
`;
const ChatBarTextArea = styled(Textarea)`
  padding-left: 8px;
  padding-right: 8px;
  border: none;
  border-radius: 4px;
  flex-grow: 1;
  line-height: 24px;
  font-size: 16px;
  resize: none;
  overflow-y: scroll;
  max-height: 100%;
  // min-height: 100%;
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;
const ChatBarInput = styled("input")`
  padding-left: 8px;
  padding-right: 8px;
  border: none;
  border-radius: 4px;
  flex-grow: 1;
  line-height: 24px;
  font-size: 16px;
  // overflow-x: scroll;
  max-height: 100%;
  // min-height: 100%;
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;
const ChatBarButton = props => {
  return (
    <button
      css={css`
        height: 100%;
        border-radius: 4px;
        line-height: 16px;
        font-size: 16px;
        text-align: center;
        border: none;
        margin-left: 12px;
        background-color: transparent;
        background-color: rgba(0, 123, 255, 0.25);
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
        &:focus,
        :hover {
          // background-color: darkblue;
          // color: white;
          outline: 0;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
        }
      `}
      onClick={props.onClick}
    >
      <FontAwesomeIcon
        icon="paper-plane"
        css={css`
          padding: 2px 8px;
        `}
      />
    </button>
  );
};
