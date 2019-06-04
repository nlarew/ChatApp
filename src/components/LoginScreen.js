import React from "react";
import styled from "@emotion/styled";
import { useStitchAuth } from "./StitchAuth";

const pass = () => {};

export default function LoginScreen(props) {
  const { isLoggedIn, currentUser, actions } = useStitchAuth();
  return (
    <Layout>
      <ButtonGroup>
        <span>isLoggedIn: {`${isLoggedIn}`}</span>
        <ProviderButton
          provider="anonymous"
          onClick={actions.handleAnonymousLogin}
        >
          Anonymous
        </ProviderButton>
        <ProviderButton provider="userpass" onClick={pass}>
          Email/Password
        </ProviderButton>
        <ProviderButton provider="facebook" onClick={pass}>
          Facebook
        </ProviderButton>
        <ProviderButton provider="google" onClick={pass}>
          Google
        </ProviderButton>
      </ButtonGroup>
    </Layout>
  );
}
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  background-color: lightgoldenrodyellow;
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
