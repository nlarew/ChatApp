import React from "react";
import styled from "@emotion/styled";
import { useStitchAuth } from "./StitchAuth";
import ModalCard from "./ModalCard";

const pass = () => {};

export default function LoginScreen(props) {
  const { isLoggedIn, currentUser, actions } = useStitchAuth();
  return (
    <Layout>
      <Content>
        <ModalCard heading="Log In to Start Chatting">
          <ButtonGroup>
            <ProviderButton
              provider="anonymous"
              onClick={actions.handleAnonymousLogin}
            >
              Anonymous
            </ProviderButton>
            <ProviderButton provider="userpass" onClick={pass}>
              Email/Password
            </ProviderButton>
            <ProviderButton
              provider="facebook"
              onClick={() => actions.handleOAuthLogin("facebook")}
            >
              Facebook
            </ProviderButton>
            <ProviderButton provider="google" onClick={pass}>
              Google
            </ProviderButton>
          </ButtonGroup>
        </ModalCard>
      </Content>
    </Layout>
  );
}
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: calc(100vh - 48px);
  box-sizing: border-box;
  background-color: lightgoldenrodyellow;
  align-items: center;
  justify-content: center;
`;
const Content = styled.div`
  min-width: 400px;
`;
const ButtonGroup = styled.div`
  margin: auto auto;
  display: flex;
  flex-direction: column;
`;
// prettier-ignore
const ProviderButton = styled.button`
  background: ${({provider}) => {
    switch (provider) {
      case "anonymous": return "grey"
      case "userpass":  return "rebeccapurple"
      case "facebook":  return "#1976F2"
      case "google":    return "#D04332"
      default: {}
    }
  }};
`;
