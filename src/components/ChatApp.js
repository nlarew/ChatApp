import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { StitchAuthProvider, useStitchAuth } from "./StitchAuth";
import LoginScreen from "./LoginScreen";
import ChatRoom from "./ChatRoom";
import RoomList from "./RoomList";
import Navbar from "./Navbar";
import { useWatchChatrooms } from "./useChatroom";

export default () => (
  <StitchAuthProvider>
    <ChatApp />
  </StitchAuthProvider>
);

function ChatApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, { addRoom, updateRooms }] = useWatchChatrooms();
  const { isLoggedIn, actions, currentUser } = useStitchAuth();
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
        currentRoom={currentRoom}
        unsetCurrentRoom={() => setCurrentRoom(null)}
        addRoom={addRoom}
      />
      <RequireLogin
        onLogout={() => setCurrentRoom(null)}
        updateRooms={updateRooms}
        finishLoading={() => setIsLoading(false)}
        isLoading={isLoading}
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
function RequireLogin({
  onLogout = () => {},
  finishLoading = () => {},
  isLoading,
  ...props
}) {
  const {
    isLoggedIn,
    actions: { handleRedirects },
  } = useStitchAuth();

  useEffect(() => {
    handleRedirects()
      .then(props.updateRooms)
      .then(finishLoading);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      !isLoggedIn && onLogout();
    }
  }, [isLoggedIn, onLogout, isLoading]);

  return isLoggedIn ? props.children : <LoginScreen />;
}
