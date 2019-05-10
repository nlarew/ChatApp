/** @jsx jsx */
import React, { useRef, useState, useEffect } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import format from "date-fns/format";

export default function ChatMessage(props) {
  const { ts, from, text } = props.message;
  const direction = props.isFromCurrentUser ? "right" : "left";
  const { isLastFromUser, isFirstFromUser } = props;
  return (
    <Layout isLastFromUser={isLastFromUser} isFirstFromUser={isFirstFromUser}>
      {!props.noHeader && (
        <Header>
          <Sender direction={direction}>{from.name}</Sender>
        </Header>
      )}
      <Content>
        <Message direction={direction} hasNext={!isLastFromUser}>
          <Timestamp direction={direction} ts={ts} />
          <div
            css={css`
              white-space: pre-wrap;
            `}
          >
            {text}
          </div>
        </Message>
      </Content>
    </Layout>
  );
}
const Layout = styled.div`
  margin: 6px 12px;
  margin-top: ${props => (props.isFirstFromUser ? "6px" : "1px")};
  margin-bottom: ${props => (props.isLastFromUser ? "6px" : "1px")};
  background-color: white;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  height: 20px;
  display: flex;
`;
const Content = styled.div`
  height: 100%;
  display: flex;
`;
const Sender = styled.p`
  display: inline-block;
  margin-right: 10px;
  font-size: 12px;
  margin-left: ${props => (props.direction === "left" ? "0px" : "auto")};
  margin-right: ${props => (props.direction === "right" ? "0px" : "auto")};
`;
const Message = styled.div`
  display: inline-block;
  background-color: ${props =>
    props.direction == "left" ? "lightgrey" : "lightblue"};
  border-radius: 12px;
  margin-left: ${props => (props.direction == "left" ? "0px" : "auto")};
  margin-right: ${props => (props.direction == "right" ? "0px" : "auto")};
  border-top-left-radius: ${props =>
    props.direction === "left" ? "0px" : "12px"};
  border-top-right-radius: ${props =>
    props.direction === "right" ? "0px" : "12px"};
  border-bottom-left-radius: ${props =>
    props.direction === "left" ? props.hasNext && "0px" : "12px"};
  border-bottom-right-radius: ${props =>
    props.direction === "right" ? props.hasNext && "0px" : "12px"};
  padding: 10px;
`;
const Timestamp = props => {
  const direction = props.direction;
  const date = new Date(props.ts);
  console.log(date);
  const MessageDate = props => {
    const formatted = format(date, "MM/DD/YYYY");
    const dateStyle = css``;
    return <span css={dateStyle}>{formatted}</span>;
  };
  const MessageTime = props => {
    const formatted = format(date, "HH:MM:SS A");
    const timeStyle = css``;
    return <span css={timeStyle}>{formatted}</span>;
  };
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
      `}
    >
      <div
        css={css`
          margin-left: ${direction === "left" ? "0px" : "auto"};
          margin-right: ${direction === "right" ? "0px" : "auto"};
          font-size: 12px;
          font-style: italic;
          padding-bottom: 4px;
        `}
      >
        <MessageDate />@<MessageTime />
      </div>
    </div>
  );
};
