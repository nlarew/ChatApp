import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ChatBar(props) {
  const { sendMessage, setMessageText, messageText } = props;
  const shouldAllowMessageSends = messageText.length > 0;
  const handleMessageSend = () => {
    if (shouldAllowMessageSends) {
      sendMessage(messageText);
      setMessageText("");
    }
  };
  const handleInput = e => setMessageText(e.target.value);
  const handleKeyPress = e => {
    if (e.key === "Enter") {
      handleMessageSend();
    }
  };
  return (
    <Layout>
      <MessageInput
        type="text"
        value={messageText}
        onChange={handleInput}
        onKeyDown={handleKeyPress}
      />
      <SendButton disabled={!shouldAllowMessageSends} onClick={handleMessageSend} />
    </Layout>
  );
}
const Layout = styled.div`
  width: 100%;
  min-height: 52px;
  background-color: lightgray;
  display: flex;
  flex-direction: row;
  padding: 12px 12px;
  box-sizing: border-box;
  flex-grow: 0;
`;
const MessageInput = styled.input`
  padding-left: 8px;
  padding-right: 8px;
  border: none;
  border-radius: 4px;
  flex-grow: 1;
  line-height: 24px;
  font-size: 16px;
  max-height: 100%;
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;
const SendButton = props => {
  const Button = styled.button`
    height: 100%;
    border-radius: 4px;
    line-height: 16px;
    font-size: 16px;
    text-align: center;
    border: none;
    margin-left: 12px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
    background-color: ${props.disabled ? "transparent" : "rgba(0, 123, 255, 0.25)"};
    color: ${props.disabled ? "darkgray" : "black"};
    &:focus,
    :hover {
      outline: 0;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
    }
  `;
  return (
    <Button onClick={props.onClick}>
      <FontAwesomeIcon icon="paper-plane" />
    </Button>
  );
};
