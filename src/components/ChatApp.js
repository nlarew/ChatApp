import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { StitchAuthProvider, useStitchAuth } from "./StitchAuth";
import LoginScreen from "./LoginScreen";
import ChatRoom from "./ChatRoom";
import RoomList from "./RoomList";
import Navbar from "./Navbar";
import { useWatchChatrooms } from "./useChatroom";
import { getCurrentUser } from "./../stitch";

export default () => (
  <StitchAuthProvider>
    <ChatApp />
  </StitchAuthProvider>
);

function ChatApp() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, { addRoom, updateRooms, clearRooms }] = useWatchChatrooms();
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
      <Navbar
        rooms={rooms}
        currentRoom={currentRoom}
        unsetCurrentRoom={() => setCurrentRoom(null)}
        addRoom={addRoom}
      />
      <RequireLogin
        onLogout={() => {
          console.log("onLogout");
          setCurrentRoom(null);
          clearRooms();
        }}
        updateRooms={updateRooms}
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
  width: 100%;
  height: 100vh;
`;
function RequireLogin({ onLogout = () => {}, isLoading, ...props }) {
  const { isLoggedIn } = useStitchAuth();
  const loginStateRef = React.useRef();
  useEffect(() => {
    const previousState = loginStateRef.current;
    if (!previousState) {
      console.log("current", getCurrentUser());
    }
    if (previousState && previousState !== isLoggedIn) {
      onLogout();
    }
    loginStateRef.current = isLoggedIn;
  }, [isLoggedIn, onLogout]);
  return isLoggedIn ? props.children : <LoginScreen />;
}
