import {
  BSON,
  Stitch,
  AnonymousCredential,
  FacebookRedirectCredential,
  GoogleRedirectCredential,
  RemoteMongoClient,
  UserPasswordCredential,
  UserPasswordAuthProviderClient,
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

// General Authentication Methods & Properties
export async function loginAnonymous() {
  return app.auth.loginWithCredential(new AnonymousCredential());
}
export async function logout() {
  if (app.auth.isLoggedIn) {
    app.auth.logoutUserWithId(app.auth.user.id);
  }
}
export function hasLoggedInUser() {
  return app.auth.isLoggedIn;
}
export function getCurrentUser() {
  return app.auth.user;
}

export function addAuthenticationListener(listener) {
  app.auth.addAuthListener(listener);
}
export function removeAuthenticationListener(listener) {
  app.auth.removeAuthListener(listener);
}

// OAuth 2.0 Login Methods
export async function loginFacebook() {
  return await app.auth.loginWithRedirect(new FacebookRedirectCredential());
}
export async function loginGoogle() {
  return await app.auth.loginWithRedirect(new GoogleRedirectCredential());
}
export const handleOAuthRedirects = () => {
  if (app.auth.hasRedirectResult()) {
    return app.auth.handleRedirectResult();
  }
};

// Email/Password Authentication Methods
export async function loginEmailPassword(email, password) {
  const credential = new UserPasswordCredential(email, password);
  return await app.auth.loginWithCredential(credential);
}
function getEmailPasswordClient() {
  return app.auth.getProviderClient(
    UserPasswordAuthProviderClient.factory,
    "local-userpass",
  );
}
export async function registerEmailPasswordUser(email, password) {
  const emailPasswordAuth = getEmailPasswordClient();
  return await emailPasswordAuth.registerWithEmail(email, password);
}
export async function resendConfirmationEmail(email) {
  const emailPasswordAuth = getEmailPasswordClient();
  return await emailPasswordAuth.resendConfirmationEmail(email);
}
export async function confirmEmailPasswordUser() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const tokenId = urlParams.get("tokenId");
  const emailPasswordAuth = getEmailPasswordClient();
  return await emailPasswordAuth.confirmUser(token, tokenId);
}

/**
 * MongoDB
 */

// Stitch MongoDB Service Client for our cluster
const mongodb = app.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");

// Collection that contains chatroom documents
const chatrooms = mongodb.db("chat").collection("rooms");

export async function getChatroomsUserIsIn() {
  if (app.auth.isLoggedIn) {
    return await chatrooms.find({ members: app.auth.user.id }).toArray();
  } else {
    return [];
  }
}
export async function searchForChatrooms(searchText) {
  const searchRegex = new BSON.BSONRegExp(`${searchText}`, "i");
  return await chatrooms.find({ name: searchRegex }).toArray();
}
export function watchChatrooms(chatroom_ids) {
  const getStream = chatrooms.watch(chatroom_ids);
  const closeStream = () => getStream.then(stream => stream.close());
  return [getStream, closeStream];
}

// Chatroom/Messages CRUD
export async function createChatroom(name) {
  const room = {
    name: name,
    owner_id: app.auth.currentUser.id,
    members: [app.auth.currentUser.id],
    messages: [],
    isPublic: true,
  };
  const result = await chatrooms.insertOne(room);
  return { ...room, _id: result.insertedId };
}
export function addMessageToRoom(message, room_id) {
  return chatrooms.updateOne({ _id: room_id }, { $push: { messages: message } });
}
export async function addUserToRoom(user_id, room_id) {
  return await chatrooms.findOneAndUpdate(
    { _id: room_id },
    { $addToSet: { members: user_id } },
    { returnNewDocument: true },
  );
}
export async function removeUserFromRoom(user_id, room_id) {
  return await chatrooms.findOneAndUpdate(
    { _id: room_id },
    { $pullAll: { members: [user_id] } },
    { returnNewDocument: true },
  );
}
