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

export async function loginAnonymous() {
  return await app.auth.loginWithCredential(new AnonymousCredential());
}
export async function loginFacebook() {
  return await app.auth.loginWithRedirect(new FacebookRedirectCredential());
}
export function hasLoggedInUser() {
  return app.auth.isLoggedIn;
}
export function getCurrentUser() {
  return app.auth.isLoggedIn ? app.auth.user : null;
}
export function handleOAuthRedirects() {
  if (app.auth.hasRedirectResult()) app.auth.handleRedirectResult();
}
export async function logout() {
  const { currentUser } = app.auth;
  return currentUser && (await app.auth.logoutUserWithId(currentUser.id));
}

/**
 * MongoDB
 */
const mongodb = app.getServiceClient(
  RemoteMongoClient.factory,
  "mongodb-atlas",
);

export const chatrooms = mongodb.db("chat").collection("rooms");
