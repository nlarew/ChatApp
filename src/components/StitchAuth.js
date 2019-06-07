import React from "react";
import {
  hasLoggedInUser,
  logout,
  getCurrentUser,
  loginAnonymous,
  loginFacebook,
  loginGoogle,
  handleOAuthRedirects,
} from "./../stitch";

// Create a React Context that lets us expose and access auth state
// without passing props through many levels of the component tree
const StitchAuthContext = React.createContext();

// Create a React Hook that lets us get data from our auth context
export function useStitchAuth() {
  const context = React.useContext(StitchAuthContext);
  if (!context) {
    throw new Error(`useStitchAuth must be used within a StitchAuthProvider`);
  }
  return context;
}

// Create a component that controls auth state and exposes it via
// the React Context we created.
export function StitchAuthProvider(props) {
  const [authState, setAuthState] = React.useState({
    isLoggedIn: hasLoggedInUser(),
    currentUser: getCurrentUser(),
  });

  // Authentication Actions
  const handleAnonymousLogin = React.useCallback(async () => {
    const { isLoggedIn } = authState;
    if (!isLoggedIn) {
      const loggedInUser = await loginAnonymous();
      setAuthState(authState => ({
        ...authState,
        isLoggedIn: true,
        currentUser: loggedInUser,
      }));
    }
  }, [authState]);
  const handleOAuthLogin = React.useCallback(
    async provider => {
      const { isLoggedIn } = authState;
      const loginMethod = {
        facebook: loginFacebook,
        google: loginGoogle,
      }[provider];
      if (!isLoggedIn) {
        loginMethod();
      }
    },
    [authState],
  );

  const handleLogout = React.useCallback(async () => {
    const { isLoggedIn } = authState;
    if (isLoggedIn) {
      await logout();
      setAuthState(authState => ({
        ...authState,
        isLoggedIn: false,
        currentUser: null,
      }));
    } else {
      console.log(`can't handleLogout when no user is logged in`);
    }
  }, [authState]);

  // We useMemo to improve performance by eliminating some re-renders
  const authInfo = React.useMemo(() => {
    const { isLoggedIn, currentUser } = authState;
    const handleRedirects = async () => {
      const loggedInUser = await handleOAuthRedirects();
      if (loggedInUser) {
        setAuthState(authState => ({
          ...authState,
          isLoggedIn: true,
          currentUser: loggedInUser,
        }));
      }
    };
    const value = {
      isLoggedIn,
      currentUser,
      actions: {
        handleAnonymousLogin,
        handleOAuthLogin,
        handleRedirects,
        handleLogout,
      },
    };
    return value;
  }, [authState, handleAnonymousLogin, handleOAuthLogin, handleLogout]);

  return (
    <StitchAuthContext.Provider value={authInfo}>
      {props.children}
    </StitchAuthContext.Provider>
  );
}