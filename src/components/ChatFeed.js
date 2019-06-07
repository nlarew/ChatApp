/** @jsx jsx */
import React, { useRef, useState, useEffect } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import ChatMessage from "./ChatMessage.js";
import { useStitchAuth } from "./StitchAuth";
import { animateScroll as scroll } from "react-scroll";

const ChatFeed = props => {
  const { messages } = props;
  const { currentUser } = useStitchAuth();
  useEffect(() => {
    scroll.scrollToBottom({
      containerId: "feed",
      duration: 320,
      delay: 40,
    });
  }, [messages]);
  const isFromCurrentUser = message => {
    return !!message && message.sender.id === currentUser.id;
  };
  const isFromSameUser = (prevMessage, thisMessage) => {
    if (!prevMessage || !thisMessage) return false;
    return prevMessage.sender.id === thisMessage.sender.id;
  };
  return (
    <ChatFeedLayout id="feed">
      <Feed>
        {messages.map((msg, i) => {
          const isFirst = i === 0;
          const isLast = i === messages.length - 1;
          const prev = !isFirst && messages[i - 1];
          const next = !isLast && messages[i + 1];
          const isFirstFromUser = !isFromSameUser(prev, msg);
          const isLastFromUser = !isFromSameUser(msg, next);
          return (
            <ChatMessage
              key={msg.ts}
              message={msg}
              isFromCurrentUser={isFromCurrentUser(msg)}
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
