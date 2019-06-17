import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useStitchAuth } from "./StitchAuth";
import LoginScreen from "./LoginScreen";
import ChatRoom from "./ChatRoom";
import RoomList from "./RoomList";
import Navbar from "./Navbar";
import { useWatchChatrooms } from "./useChatroom";
import { ToastContainer } from "react-toastify";

export default function ChatApp(props) {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, { addRoom, updateRooms, clearRooms }] = useWatchChatrooms();
  const { currentUser } = useStitchAuth();
  useEffect(() => {
    updateRooms();
  }, [currentUser]);
  useEffect(() => {
    if (currentRoom) {
      const updatedRoom = rooms.find(
        r => r._id.toString() === currentRoom._id.toString(),
      );
      setCurrentRoom(updatedRoom || null);
    }
  }, [rooms, currentRoom]);

  return (
    <Layout>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
      />
      <Navbar
        rooms={rooms}
        currentRoom={currentRoom}
        unsetCurrentRoom={() => setCurrentRoom(null)}
        addRoom={addRoom}
      />
      <RequireLogin
        onLogout={() => {
          setCurrentRoom(null);
          clearRooms();
        }}
      >
        {currentRoom ? (
          <ChatRoom room={currentRoom} />
        ) : (
          <RoomList rooms={rooms} setCurrentRoom={setCurrentRoom} />
        )}
      </RequireLogin>
    </Layout>
  );
}
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
`;
function RequireLogin({ onLogout = () => {}, isLoading, ...props }) {
  const { isLoggedIn } = useStitchAuth();
  return isLoggedIn ? props.children : <LoginScreen />;
}
