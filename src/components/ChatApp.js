import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { StitchAuthProvider, useStitchAuth } from "./StitchAuth";
import LoginScreen from "./LoginScreen";
import ChatRoom from "./ChatRoom";
import RoomList from "./RoomList";
import Navbar from "./Navbar";
import { useWatchChatrooms } from "./useChatroom";
import { logCurrentStitchUser } from "./../stitch";

export default function ChatApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, { addRoom, updateRooms }] = useWatchChatrooms();
  useEffect(() => {
    if (currentRoom) {
      const updatedRoom = rooms.find(
        r => r._id.toString() === currentRoom._id.toString(),
      );
      setCurrentRoom(updatedRoom || null);
    }
  }, [rooms, currentRoom]);
  const onLogout = () =>
    console.log("onLogout") && currentRoom && setCurrentRoom(null);
  return (
    <StitchAuthProvider>
      <Layout>
        <Navbar
          currentRoom={currentRoom}
          unsetCurrentRoom={() => setCurrentRoom(null)}
          addRoom={addRoom}
        />
        <RequireLogin
          onLogout={onLogout}
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
    </StitchAuthProvider>
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
