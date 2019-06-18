import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useStitchAuth } from "./StitchAuth";
import LoginScreen from "./LoginScreen";
import ChatRoom from "./ChatRoom";
import RoomList from "./RoomList";
import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";
import {
  useChatrooms,
  // useWatchChatrooms
} from "./useChatroom";

export default function ChatApp(props) {
  // const [rooms, { addRoom }] = useChatrooms();
  const [rooms, { addRoom }] = useWatchChatrooms();
  const [currentRoom, setCurrentRoom, unsetCurrentRoom] = useCurrentRoom(rooms);
  return (
    <Layout>
      <Navbar
        rooms={rooms}
        currentRoom={currentRoom}
        unsetCurrentRoom={unsetCurrentRoom}
        addRoom={addRoom}
      />
      <RequireLogin>
        {currentRoom ? (
          <ChatRoom room={currentRoom} />
        ) : (
          <RoomList rooms={rooms} setCurrentRoom={setCurrentRoom} />
        )}
      </RequireLogin>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
      />
    </Layout>
  );
}
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
`;
function useCurrentRoom(rooms) {
  const [currentRoom, setCurrentRoom] = useState(null);
  useEffect(() => {
    if (currentRoom) {
      const currentRoomId = currentRoom._id.toString();
      const updatedRoom = rooms.find(r => r._id.toString() === currentRoomId);
      setCurrentRoom(updatedRoom || null);
    }
  }, [rooms, currentRoom]);
  const unsetCurrentRoom = () => setCurrentRoom(null);
  return [currentRoom, setCurrentRoom, unsetCurrentRoom];
}
function RequireLogin(props) {
  const { isLoading, isLoggedIn } = useStitchAuth();
  if(isLoading) {
    return null
  } else {
    return isLoggedIn ? props.children : <LoginScreen />;
  }
}
