/** @jsx jsx */
import React, { useRef, useState, useEffect } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import format from "date-fns/format";

export default function ChatMessage(props) {
  const { ts, from, text } = props.message;
  const direction = props.fromCurrentUser ? "right" : "left";
  return (
    <Layout>
      <Header>
        <Sender direction={direction}>{from.name}</Sender>
      </Header>
      <Content>
        <Message direction={direction}>
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
  margin: 4px 12px;
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
  margin-top: 6px;
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
  padding: 10px;
`;
const Timestamp = props => {
  const direction = props.direction;
  const date = Date(props.ts);
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
