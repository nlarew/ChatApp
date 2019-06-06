/** @jsx jsx */
import React, { useRef, useState, useEffect } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

import USER from "./../stubs/user";

import ChatFeed from "./ChatFeed";
import ChatBar from "./ChatBar";

/* This component manages the state of the entire chat room.
 * NOTE: Requires a logged in Stitch user
 */
export default function ChatRoom(props) {
  const [messages, setMessages] = useState(props.room.messages);
  const [messageText, setMessageText] = useState("");
  const sendMessage = text => {
    const ts = Date.now();
    const from = {
      id: USER.id,
      name: `${USER.profile.firstName} ${USER.profile.lastName}`,
    };
    setMessages([...messages, { ts, from, text }]);
  };

  return (
    <Layout>
      <ChatFeed messages={messages} />
      <ChatBar
        sendMessage={sendMessage}
        setMessageText={setMessageText}
        messageText={messageText}
      />
    </Layout>
  );
}
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 48px);
  max-height: 100vh;
  background-color: white;
`;
