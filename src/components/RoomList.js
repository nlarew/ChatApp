import React, { useState } from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStitchAuth } from "./StitchAuth";
import { archiveChatroom } from "./../stitch";

import ROOMS from "./../stubs/rooms";

export default function RoomList({
  rooms = ROOMS,
  currentRoom,
  setCurrentRoom,
}) {
  return (
    <Layout>
      <List>
        {rooms.length > 0 &&
          rooms.map(room => {
            const roomId = room._id.toString();
            const setAsCurrentRoom = () => setCurrentRoom(room);
            const isCurrentRoom = currentRoom && currentRoom._id === room._id;
            return (
              <Room
                key={roomId}
                room={room}
                onClick={setAsCurrentRoom}
                isCurrentRoom={isCurrentRoom}
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
  height: 100vh;
`;
const List = styled.ul`
  list-style: none;
  padding: 0;
`;
function Room({ room, ...props }) {
  const { currentUser } = useStitchAuth();
  const isOwner = room.owner_id === currentUser.id;
  const handleArchive = e => {
    e.stopPropagation();
    archiveChatroom(room._id);
  };
  return (
    <RoomListItem isArchived={room.isArchived} {...props}>
      <RoomName>{room.name}</RoomName>
      {room.isArchived && "ARCHIVED"}
      <RoomData>
        {room.members.length} <MembersIcon />
      </RoomData>
      <RoomData>
        {room.messages.length} <MessagesIcon />
      </RoomData>
      {isOwner && !room.isArchived && (
        <RoomAction bgcolor="#E53A40" color="white" onClick={handleArchive}>
          <DeleteIcon />
        </RoomAction>
      )}
    </RoomListItem>
  );
}
const RoomListItem = styled.li`
  background: ${props => props.isCurrentRoom && "palegoldenrod"};
  background: ${props => props.isArchived && "darkgrey"};
  @media (min-width: 880px) {
    background: ${props => props.isCurrentRoom && "palevioletred"};
  }
  padding: 14px;
  border-bottom: 0.5px solid black;
  display: flex;
  align-items: center;
`;
const RoomName = styled.span`
  margin-right: auto;
`;
const RoomData = styled.div`
  padding: 8px 10px;
  border-radius: 4px;
  line-height: 16px;
  font-size: 16px;
  text-align: right;
  border: none;
  margin-left: 12px;
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
const DeleteIcon = () => <FontAwesomeIcon icon="times-circle" />;
