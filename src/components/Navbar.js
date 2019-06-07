import React from "react";
import styled from "@emotion/styled";
import { useStitchAuth } from "./StitchAuth";
import useModal from "./useModal";
import { createChatroom } from "./../stitch";
import InputModalCard from "./InputModalCard";

export default function Navbar({ currentRoom, unsetCurrentRoom, addRoom }) {
  const {
    currentUser,
    isLoggedIn,
    actions: { handleLogout },
  } = useStitchAuth();
  const [Modal, isOpen, { openModal, closeModal }] = useModal("createNewRoom");
  const createRoomWithName = async name => {
    const room = await createChatroom({ name });
    if (room) {
      addRoom(room);
      closeModal();
    }
  };
  return (
    <Layout>
      <NavbarLeft>
        {isLoggedIn &&
          (currentRoom ? (
            <Button onClick={unsetCurrentRoom}>All Rooms</Button>
          ) : (
            <>
              <Button onClick={() => openModal()}>Create a New Room</Button>
              <Modal isOpen={isOpen}>
                <InputModalCard handleSubmit={createRoomWithName} />
              </Modal>
            </>
          ))}
      </NavbarLeft>
      {!isLoggedIn && "ChatApp"}
      {currentRoom && currentRoom.name}
      {currentUser ? currentUser.id : "logged out"}
      <NavbarRight>
        {isLoggedIn && <Button onClick={handleLogout}>Log Out</Button>}
      </NavbarRight>
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
  text-align: right;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: grey;
  color: ${props => props.color || "white"};
`;
