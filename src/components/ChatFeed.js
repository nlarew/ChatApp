/** @jsx jsx */
import React, { useRef, useState, useEffect } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import ChatMessage from "./ChatMessage.js";
import { animateScroll as scroll } from "react-scroll";

const USER = {
  id: "20391029481029849124",
  profile: {
    firstName: "Jessica",
    lastName: "Real",
  },
};

const ChatFeed = props => {
  const { messages } = props;
  useEffect(
    () => {
      scroll.scrollToBottom({
        containerId: "feed",
        duration: 320,
        delay: 40,
      });
    },
    [messages],
  );
  const isFromCurrentUser = message => {
    return !!message && message.from.id === USER.id;
  };
  return (
    <ChatFeedLayout id="feed">
      <Feed messages={messages}>
        {messages.map((m, i) => {
          const isFirst = i === 0;
          const isLast = i === messages.length - 1;
          const prevIsFromCurrentUser =
            isFromCurrentUser(messages[i - 1]) || false;
          const nextIsFromCurrentUser =
            isFromCurrentUser(messages[i + 1]) || false;
          const isFirstFromUser =
            isFirst || isFromCurrentUser(m)
              ? !prevIsFromCurrentUser
              : prevIsFromCurrentUser;
          const isLastFromUser =
            isLast || isFromCurrentUser(m)
              ? !nextIsFromCurrentUser
              : nextIsFromCurrentUser;
          return (
            <ChatMessage
              key={m.ts}
              message={m}
              isFromCurrentUser={isFromCurrentUser(m)}
              noHeader={!isFirstFromUser}
              isFirstFromUser={isFirstFromUser}
              isLastFromUser={isLastFromUser}
            />
          );
        })}
      </Feed>
    </ChatFeedLayout>
  );
};
export default ChatFeed;

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
