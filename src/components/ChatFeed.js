/** @jsx jsx */
import React, { useRef, useState, useEffect } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import ChatMessage from "./ChatMessage.js";

const USER = {
  id: "20391029481029849124",
  profile: {
    firstName: "Jessica",
    lastName: "Real",
  },
};

export default function ChatFeed(props) {
  const { messages } = props;
  return (
    <ChatFeedLayout>
      <Feed>
        {messages.map(m => (
          <ChatMessage
            key={m.ts}
            message={m}
            fromCurrentUser={m.from.id === USER.id}
          />
        ))}
      </Feed>
    </ChatFeedLayout>
  );
}
const ChatFeedLayout = styled.div`
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
  overflow-y: scroll;
`;
const Feed = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  box-sizing: border-box;
`;
