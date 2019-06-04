import {
  Stitch,
  AnonymousCredential,
  FacebookRedirectCredential,
  RemoteMongoClient,
} from "mongodb-stitch-browser-sdk";

/**
 * App Client Initialization - Connect to Stitch!
 */

const APP_ID = "chatapp-axspa";
const app = Stitch.hasAppClient(APP_ID)
  ? Stitch.getAppClient(APP_ID)
  : Stitch.initializeAppClient(APP_ID);

/**
 * Authentication
 */

const {
  loginWithCredential,
  loginWithRedirect,
  handleRedirectResult,
  logoutUserWithId,
} = app.auth;

export async function loginAnonymous() {
  console.log("hi", app);
  const result = await app.auth.loginWithCredential(new AnonymousCredential());
  console.log("result", result);
  return result;
  // return await loginWithCredential(new AnonymousCredential());
}
export async function loginFacebook() {
  return await loginWithRedirect(new FacebookRedirectCredential());
}
export function hasLoggedInUser() {
  return app.auth.isLoggedIn;
}

export function getCurrentUser() {
  return app.auth.isLoggedIn ? app.auth.user : null;
}
export function handleOAuthRedirects() {
  if (app.auth.hasRedirectResult()) handleRedirectResult();
}
export async function logout() {
  const { currentUser } = app.auth;
  return currentUser && (await logoutUserWithId(currentUser.id));
}

/**
 * MongoDB
 */

const mongodb = app.getServiceClient(
  RemoteMongoClient.factory,
  "mongodb-atlas",
);

export const chatrooms = mongodb.db("chat").collection("rooms");
