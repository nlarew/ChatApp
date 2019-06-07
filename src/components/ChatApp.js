import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { StitchAuthProvider, useStitchAuth } from "./StitchAuth";
import LoginScreen from "./LoginScreen";
import ChatRoom from "./ChatRoom";
import RoomList from "./RoomList";
import Navbar from "./Navbar";
import { useWatchChatrooms } from "./useChatroom";

function RequireLogin({ onLogout = () => {}, ...props }) {
  const { isLoggedIn } = useStitchAuth();
  useEffect(() => {
    !isLoggedIn && onLogout();
  }, [isLoggedIn, onLogout]);
  return isLoggedIn ? props.children : <LoginScreen />;
}

export default function ChatApp() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, addRoom] = useWatchChatrooms();
  const onLogout = () => currentRoom && setCurrentRoom(null);
  return (
    <StitchAuthProvider>
      <Layout>
        <Navbar
          currentRoom={currentRoom}
          unsetCurrentRoom={() => setCurrentRoom(null)}
          addRoom={addRoom}
        />
        <RequireLogin onLogout={onLogout}>
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
