/** @jsx jsx */
import React, { useRef, useState, useEffect } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

import ChatFeed from "./ChatFeed";
import ChatBar from "./ChatBar";

const USER = {
  id: "20391029481029849124",
  profile: {
    firstName: "Jessica",
    lastName: "Real",
  },
};

const MESSAGES = [
  {
    ts: 1557355231922,
    from: { id: "40391024481629829197", name: "Jack Example" },
    text: "Wanna meet up with Tim at 8 for dinner?",
  },
  {
    ts: 1557355239361,
    from: { id: "20391029481029849124", name: "Jessica Real" },
    text: "Yeah that works for me!",
  },
  {
    ts: 1557355245967,
    from: { id: "20391029481029849124", name: "Jessica Real" },
    text:
      "What restaurant should we go to? There's a place in the LES that I've wanted to try for a while.",
  },
  {
    ts: 1557355249520,
    from: { id: "40391024481629829197", name: "Jack Example" },
    text: "What kind of food?",
  },
  {
    ts: 1557355255359,
    from: { id: "20391029481029849124", name: "Jessica Real" },
    text: "Mediterranean! Merguez 😍😍😍",
  },
  {
    ts: 1557355259651,
    from: { id: "40391024481629829197", name: "Jack Example" },
    text: "Sounds great lets do it!",
  },
];

/* This component manages the state of the entire chat room.
 * NOTE: Requires a logged in Stitch user
 */
export default function ChatRoom(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    // Set up the collection watch stream
    // TODO: Need to know the document structure
    setMessages(MESSAGES);
    setIsLoading(false);
  }, []);
  const sendMessage = text => {
    const ts = Date.now();
    const from = {
      id: USER.id,
      name: `${USER.profile.firstName} ${USER.profile.lastName}`,
    };
    setMessages([...messages, { ts, from, text }]);
  };

  const [messageText, setMessageText] = useState("");

  return (
    <ChatLayout>
      <ChatFeed messages={messages} />
      <ChatBar
        sendMessage={sendMessage}
        setMessageText={setMessageText}
        messageText={messageText}
      />
    </ChatLayout>
  );
}
const ChatLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  background-color: white;
`;
