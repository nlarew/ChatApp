import React from "react";
import styled from "@emotion/styled";
import { useStitchAuth } from "./StitchAuth";
import Card from "./ModalCard";
import Loader from "react-loader-spinner";
import EmailPasswordLoginModal from "./EmailPasswordLoginModal";
import useModal from "./useModal";

export default function LoginScreen(props) {
  const { actions } = useStitchAuth();

  const [emailModal, emailModalIsOpen, emailModalActions] = useModal("email");

  const [isHandlingLogin, setIsHandlingLogin] = React.useState(false);
  const handleLogin = provider => {
    setIsHandlingLogin(true);
    actions.handleLogin(provider);
  };
  return (
    <Layout>
      <Content>
        <Card heading="Log In to Start Chatting">
          {isHandlingLogin ? (
            <span>
              Logging in
              <Loader type="MutatingDot" color="#00BFFF" height="100" width="100" />
            </span>
          ) : (
            <ButtonGroup>
              <ProviderButton
                provider="anonymous"
                onClick={() => handleLogin("anonymous")}
              >
                Anonymous
              </ProviderButton>
              <ProviderButton provider="userpass" onClick={emailModalActions.open}>
                Email/Password
              </ProviderButton>
              <ProviderButton provider="facebook" onClick={() => handleLogin("facebook")}>
                Facebook
              </ProviderButton>
              <ProviderButton provider="google" onClick={() => handleLogin("google")}>
                Google
              </ProviderButton>
            </ButtonGroup>
          )}
        </Card>
        <EmailPasswordLoginModal
          {...emailModal}
          actions={emailModalActions}
          isOpen={emailModalIsOpen}
          onRequestClose={emailModalActions.close}
        />
      </Content>
    </Layout>
  );
}
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);
  box-sizing: border-box;
  background-color: #8cd790;
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
  background: ${({provider, disabled}) => {
    if (disabled) return "lightgrey"
    switch (provider) {
      case "anonymous": return "orange"
      case "userpass":  return "rebeccapurple"
      case "facebook":  return "#1976F2"
      case "google":    return "#D04332"
      default: {}
    }
  }};
  color: ${({provider, disabled}) => {
    if (disabled) return "white"
    switch (provider) {
      case "anonymous": return "black"
      case "userpass":  return "white"
      case "facebook":  return "white"
      case "google":    return "white"
      default: {}
    }
  }};
`;
