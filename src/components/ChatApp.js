import React, { useState } from "react";
import styled from "@emotion/styled";
import { StitchAuthProvider, useStitchAuth } from "./StitchAuth";
import LoginScreen from "./LoginScreen";
import ChatRoom from "./ChatRoom";
import RoomList from "./RoomList";

function RequireLogin({ onLogout = () => {}, ...props }) {
  const { isLoggedIn } = useStitchAuth();
  React.useEffect(() => {
    !isLoggedIn && onLogout();
  }, [isLoggedIn, onLogout]);
  return isLoggedIn ? props.children : <LoginScreen />;
}

export default function ChatApp() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const onLogout = () => currentRoom && setCurrentRoom(null);
  return (
    <StitchAuthProvider>
      <Layout>
        <Navbar
          currentRoom={currentRoom}
          unsetCurrentRoom={() => setCurrentRoom(null)}
        />
        <RequireLogin onLogout={onLogout}>
          {currentRoom ? (
            <ChatRoom room={currentRoom} />
          ) : (
            <RoomList setCurrentRoom={setCurrentRoom} />
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
function Navbar({ currentRoom, unsetCurrentRoom }) {
  const { isLoggedIn, actions } = useStitchAuth();
  return (
    <NavbarLayout>
      <NavbarLeft>
        {currentRoom ? (
          <button onClick={unsetCurrentRoom}>All Rooms</button>
        ) : (
          <button onClick={unsetCurrentRoom}>Create a New Room</button>
        )}
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
