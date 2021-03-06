import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStitchAuth } from "./StitchAuth";
import { removeUserFromRoom } from "./../stitch";

export default function RoomList({ rooms = [], currentRoom, setCurrentRoom }) {
  const { currentUser } = useStitchAuth();
  const userIsInRoom = room => room.members.includes(currentUser.id);
  return (
    <Layout>
      <List>
        {rooms.length > 0 &&
          rooms.filter(userIsInRoom).map(room => {
            const roomId = room._id.toString();
            const isCurrentRoom = currentRoom && currentRoom._id === room._id;
            const setAsCurrentRoom = () => setCurrentRoom(room);
            return (
              <Room
                key={roomId}
                room={room}
                isCurrentRoom={isCurrentRoom}
                onClick={setAsCurrentRoom}
              />
            );
          })}
      </List>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 48px);
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 5px;
    &-track {
      background: #ddd;
    }
    &-thumb {
      background: #666;
    }
  }
`;
const List = styled.ul`
  list-style: none;
  padding: 0;
  flex-grow: 1;
`;
export function Room({ room, ...props }) {
  const { currentUser } = useStitchAuth();
  const isMember = currentUser && room.members.includes(currentUser.id);
  const handleLeave = e => {
    e.stopPropagation();
    removeUserFromRoom(currentUser.id, room._id);
  };
  return (
    <RoomListItem {...props}>
      <NumMembers num={room.members.length} />
      <NumMessages num={room.messages.length} />
      <RoomName>{room.name}</RoomName>
      {isMember && (
        <RoomAction bgcolor="#E0E3DA" color="black" onClick={handleLeave}>
          <LeaveIcon />
        </RoomAction>
      )}
    </RoomListItem>
  );
}
const RoomListItem = styled.li`
  background: ${props => props.isCurrentRoom && "palegoldenrod"};
  padding: 14px;
  border-bottom: 0.5px solid black;
  display: flex;
  align-items: center;
`;
const RoomName = styled.span`
  padding-left: 4px;
  margin-right: auto;
`;
const RoomData = styled.div`
  padding: 8px 10px;
  border-radius: 4px;
  line-height: 16px;
  font-size: 16px;
  text-align: right;
  border: none;

  margin-right: 12px;
  color: ${props => (props.disabled ? "darkgray" : "black")};
`;
const RoomAction = styled.button`
  padding: 8px 10px;
  border-radius: 4px;
  line-height: 16px;
  font-size: 16px;
  text-align: right;
  border: none;
  margin-left: 12px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: ${props => props.bgcolor || "#8CD790"};
  color: ${props => props.color || "white"};
`;
const MembersIcon = () => <FontAwesomeIcon icon="users" />;
const MessagesIcon = () => <FontAwesomeIcon icon="comments" />;
// const DeleteIcon = () => <FontAwesomeIcon icon="times-circle" />;
const LeaveIcon = () => <FontAwesomeIcon icon="sign-out-alt" />;
export const NumMembers = ({ num }) => (
  <RoomData>
    {num} <MembersIcon />
  </RoomData>
);
export const NumMessages = ({ num }) => (
  <RoomData>
    {num} <MessagesIcon />
  </RoomData>
);
