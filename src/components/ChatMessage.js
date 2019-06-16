import React from "react";
import styled from "@emotion/styled";
import format from "date-fns/format";
import useDebounce from "./useDebounce";

export default function ChatMessage(props) {
  const { ts, sender, text } = props.message;
  const direction = props.isFromCurrentUser ? "right" : "left";
  const { isLastFromUser, isFirstFromUser } = props;
  const [messageRowRef, isHoveringMessageRow] = useHover();
  const [timestampRef, isHoveringTimestamp] = useHover();
  const isHovered = isHoveringMessageRow || isHoveringTimestamp;
  return (
    <Layout
      ref={messageRowRef}
      isLastFromUser={isLastFromUser}
      isFirstFromUser={isFirstFromUser}
    >
      {!props.noHeader && (
        <Header>
          <Sender direction={direction} sender={sender} />
        </Header>
      )}
      <Content>
        {isHovered && direction === "right" && (
          <Timestamp ref={timestampRef} direction={direction} ts={ts} />
        )}
        <Message direction={direction} hasNext={!isLastFromUser}>
          <MessageText>{text}</MessageText>
        </Message>
        {isHovered && direction === "left" && (
          <Timestamp ref={timestampRef} direction={direction} ts={ts} />
        )}
      </Content>
    </Layout>
  );
}
const Layout = styled.div`
  margin: 6px 12px;
  margin-top: ${props => (props.isFirstFromUser ? "6px" : "1px")};
  margin-bottom: ${props => (props.isLastFromUser ? "6px" : "1px")};
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  height: 20px;
  display: flex;
  margin-bottom: 4px;
`;
const Content = styled.div`
  height: 100%;
  display: flex;
  :hover {
    background: #eee;
  }
`;
const Sender = React.memo(({ direction, sender }) => {
  const SenderName = styled.p`
    display: inline-block;
    margin-right: 10px;
    font-size: 12px;
    margin-left: ${direction === "left" ? "0px" : "auto"};
    margin-right: ${direction === "right" ? "0px" : "auto"};
  `;
  const SenderPicture = styled.img`
    border-radius: 50%;
    height: 100%;
    margin-left: 10px;
  `;
  return (
    <>
      {direction === "left" && sender.picture && (
        <SenderPicture alt="hi" src={sender.picture} />
      )}
      <SenderName>{sender.name}</SenderName>
      {direction === "right" && sender.picture && (
        <SenderPicture alt="hi" src={sender.picture} />
      )}
    </>
  );
});
const Message = styled.div`
  max-width: 60%;
  display: inline-block;
  background-color: ${props =>
    props.direction === "left" ? "lightgrey" : "lightblue"};
  border-radius: 12px;
  margin-left: ${props => (props.direction === "left" ? "0px" : "auto")};
  margin-right: ${props => (props.direction === "right" ? "0px" : "auto")};
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
const MessageText = styled.div`
  white-space: pre-wrap;
`;
const Timestamp = props => {
  const date = new Date(props.ts);
  const formattedDate = format(date, "MM/DD/YYYY");
  const formattedTime = format(date, "HH:MM:SS A");
  const TimestampLayout = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: ${({ direction }) => (direction === "right" ? "0px" : "auto")};
    margin-right: ${({ direction }) => (direction === "left" ? "0px" : "auto")};
    font-size: 12px;
    font-style: italic;
    align-items: center;
    :${props.direction === "left" ? "after" : "before"} {
      content: "${formattedDate} @ ${formattedTime}";
      line-height: 12px;
      font-size: 100%;
      font-style: italic;
      position: relative;
    }
  `;
  return <TimestampLayout direction={props.direction} />;
};

function useHover() {
  const [value, setValue] = React.useState(false);
  const debouncedValue = useDebounce(value, 15);

  const ref = React.useRef(null);

  const handleMouseOver = e => setValue(true);
  const handleMouseOut = () => setValue(false);

  React.useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener("mouseover", handleMouseOver);
        node.addEventListener("mouseout", handleMouseOut);

        return () => {
          node.removeEventListener("mouseover", handleMouseOver);
          node.removeEventListener("mouseout", handleMouseOut);
        };
      }
    },
    [ref.current], // Recall only if ref changes
  );

  return [ref, debouncedValue];
}
