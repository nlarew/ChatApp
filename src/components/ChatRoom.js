/** @jsx jsx */
import React, { useRef, useState, useEffect } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { useStitchAuth } from "./StitchAuth";
import { addMessageToRoom } from "./../stitch";

import ChatFeed from "./ChatFeed";
import ChatBar from "./ChatBar";
import { BSON } from "mongodb-stitch-core-sdk";

/* This component manages the state of the entire chat room.
 * NOTE: Requires a logged in Stitch user
 */
const formatUsername = user => {
  const {
    profile: { firstName, lastName },
  } = user;
  return firstName && lastName ? `${firstName} ${lastName}` : "Anonymous";
};

export default function ChatRoom(props) {
  const { isArchived } = props.room;
  const { currentUser } = useStitchAuth();
  const [messages, setMessages] = useState(props.room.messages);
  useEffect(() => {
    setMessages(props.room.messages);
  }, [props.room.messages, props.room.messages.length]);
  const [messageText, setMessageText] = useState("");
  const sendMessage = text => {
    const _id = new BSON.ObjectId();
    const ts = Date.now();
    const sender = {
      id: currentUser.id,
      name: formatUsername(currentUser),
      picture: currentUser.profile.data.picture,
    };
    const message = { _id, ts, sender, text };
    addMessageToRoom(message, props.room._id);
    setMessages([...messages, message]);
  };

  return (
    <Layout>
      <ChatFeed isArchived={isArchived} messages={messages} />
      <ChatBar
        sendMessage={sendMessage}
        setMessageText={setMessageText}
        messageText={messageText}
        isArchived={isArchived}
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
