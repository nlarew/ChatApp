import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { useStitchAuth } from "./StitchAuth";
import useModal from "./useModal";
import { createChatroom, searchForChatrooms, addUserToRoom } from "./../stitch";
import InputModal from "./InputModal";
import SearchModal from "./SearchModal";

export default function Navbar({
  rooms,
  currentRoom,
  unsetCurrentRoom,
  addRoom,
}) {
  const {
    currentUser,
    isLoggedIn,
    actions: { handleLogout },
  } = useStitchAuth();
  const [newRoomModalProps, newRoomModalIsOpen, newRoomModalActions] = useModal(
    "createNewRoom",
  );
  const [searchModalProps, searchModalIsOpen, searchModalActions] = useModal(
    "search",
  );
  const [newRoomError, setNewRoomError] = React.useState(null);
  const createRoomWithName = async name => {
    if (newRoomError) {
      setNewRoomError(null);
    }
    const room = await createChatroom({ name }).catch(err => {
      console.log(err);
      const isDuplicate = /Duplicate key error/.test(err.message);
      if (isDuplicate) setNewRoomError("Room name is already in use.");
    });
    if (room) {
      addRoom(room);
      newRoomModalActions.close();
    }
  };
  const addUsertoSearchedRoom = async room => {
    const result = await addUserToRoom(currentUser.id, room._id);
    if (result) {
      addRoom(result);
    }
  };
  const handleSearch = React.useCallback(searchForChatrooms, []);
  const handleSearchResult = React.useCallback(addUsertoSearchedRoom, [
    rooms,
    currentUser,
  ]);
  const filterSearchedRooms = React.useCallback(
    searchedRooms => {
      if (currentUser) {
        const userIsInRoom = room => room.members.includes(currentUser.id);
        const userRoomIds = rooms
          .filter(userIsInRoom)
          .map(r => r._id.toString());
        const joinableRooms = searchedRooms.filter(
          searchedRoom => !userRoomIds.includes(searchedRoom._id.toString()),
        );
        return joinableRooms;
      } else {
        return [];
      }
    },
    [rooms, currentUser],
  );
  const NavTitle = () => {
    if (isLoggedIn) {
      if (currentRoom) {
        const { isArchived, name } = currentRoom;
        const text = isArchived ? `${name} - ARCHIVED` : name;
        return text;
      } else {
        return (
          <Button onClick={searchModalActions.open}>
            Search for Chatrooms
          </Button>
        );
      }
    } else {
      return "ChatApp";
    }
  };
  return (
    <Layout>
      <NavbarLeft>
        {isLoggedIn &&
          (currentRoom ? (
            <Button onClick={unsetCurrentRoom}>All Rooms</Button>
          ) : (
            <Button onClick={newRoomModalActions.open}>New Room</Button>
          ))}
      </NavbarLeft>
      <NavTitle />
      <NavbarRight>
        {isLoggedIn && <Button onClick={handleLogout}>Log Out</Button>}
      </NavbarRight>
      <InputModal
        {...newRoomModalProps}
        isOpen={newRoomModalIsOpen}
        handleSubmit={createRoomWithName}
        errorMessage={newRoomError}
      />
      <SearchModal
        {...searchModalProps}
        isOpen={searchModalIsOpen}
        handleSearch={handleSearch}
        searchFilter={filterSearchedRooms}
        handleSearchResult={handleSearchResult}
      />
    </Layout>
  );
}
const Layout = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid black;
  padding: 0 14px;
`;
const NavbarLeft = styled.div`
  width: 25%;
  flex-grow: 1;
  margin-right: auto;
  display: flex;
  justify-content: flex-start;
`;
const NavbarRight = styled.div`
  width: 25%;
  flex-grow: 1;
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
`;
const Button = styled.button`
  padding: 8px 10px;
  border-radius: 4px;
  line-height: 16px;
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: grey;
  color: ${props => props.color || "white"};
`;
