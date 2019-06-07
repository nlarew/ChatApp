import React from "react";
import styled from "@emotion/styled";
import { useStitchAuth } from "./StitchAuth";
import useModal from "./useModal";
import { createChatroom } from "./../stitch";
import InputModalCard from "./InputModalCard";

export default function Navbar({ currentRoom, unsetCurrentRoom, addRoom }) {
  const {
    isLoggedIn,
    actions: { handleLogout },
  } = useStitchAuth();
  const [Modal, isOpen, { openModal, closeModal }] = useModal("createNewRoom");
  const createRoomWithName = async name => {
    const room = await createChatroom({ name });
    addRoom(room);
    closeModal();
  };
  return (
    <NavbarLayout>
      <NavbarLeft>
        {isLoggedIn &&
          (currentRoom ? (
            <button onClick={unsetCurrentRoom}>All Rooms</button>
          ) : (
            <>
              <button onClick={() => openModal()}>Create a New Room</button>
              <Modal isOpen={isOpen}>
                <InputModalCard handleSubmit={createRoomWithName} />
              </Modal>
            </>
          ))}
      </NavbarLeft>
      {currentRoom && currentRoom.name}
      <NavbarRight>
        {isLoggedIn && <button onClick={handleLogout}>Log Out</button>}
      </NavbarRight>
    </NavbarLayout>
  );
}
const NavbarLayout = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid black;
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
