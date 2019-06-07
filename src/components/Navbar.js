import React from "react";
import styled from "@emotion/styled";
import { useStitchAuth } from "./StitchAuth";
import useModal from "./useModal";
import { createChatroom } from "./../stitch";
import { useInput } from "react-hanger";

export default function Navbar({ currentRoom, unsetCurrentRoom }) {
  const [NewRoomModal, newRoomModalIsOpen, newRoomModalActions] = useModal(
    "createNewRoom",
  );
  const { openModal } = newRoomModalActions;
  const { isLoggedIn, actions } = useStitchAuth();
  return (
    <NavbarLayout>
      <NavbarLeft>
        {isLoggedIn &&
          (currentRoom ? (
            <button onClick={unsetCurrentRoom}>All Rooms</button>
          ) : (
            <>
              <button onClick={() => openModal()}>Create a New Room</button>
              <NewRoomModal isOpen={newRoomModalIsOpen}>
                <NewChatroomCard
                  createChatroom={createChatroom}
                  closeModal={newRoomModalActions.closeModal}
                />
              </NewRoomModal>
            </>
          ))}
      </NavbarLeft>
      {currentRoom && currentRoom.name}
      <NavbarRight>
        {isLoggedIn && <button onClick={actions.handleLogout}>Log Out</button>}
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
const Card = styled.div`
  width: 100%;
  /* display: flex;
  flex-direction: column; */
  background: white;
  padding: 14px;
  border-radius: 4px;
  border: 0.5px solid rgba(0, 0, 0, 0.5);
  text-align: center;
`;
const CardHeader = styled.h1``;
const CardContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  align-items: center;
`;

const NewChatroomCard = ({ createChatroom, closeModal, addRoom }) => {
  const newRoomInput = useInput("");
  const handleSubmit = async () => {
    const name = newRoomInput.value;
    const room = await createChatroom({ name });
    addRoom(room);
    newRoomInput.clear();
    closeModal();
  };
  return (
    <Card>
      <CardHeader>Create a New Room</CardHeader>
      <CardContent>
        <ActionInput>
          <Input
            placeholder="Room Name"
            value={newRoomInput.value}
            onChange={newRoomInput.onChange}
          />
          <button onClick={handleSubmit}>Create</button>
        </ActionInput>
      </CardContent>
    </Card>
  );
};
const ActionInput = styled.div`
  width: 80%;
  display: flex;
  margin-bottom: 26px;
`;
const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
`;
