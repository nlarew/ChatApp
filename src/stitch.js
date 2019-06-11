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
export { app };
/**
 * Authentication
 */
export function getAllUsers() {
  return app.auth.listUsers();
}
export async function loginAnonymous() {
  console.log("logging in with anonymous");
  return app.auth.loginWithCredential(new AnonymousCredential());
}
export async function loginFacebook() {
  console.log("logging in with facebook");
  return await app.auth.loginWithRedirect(new FacebookRedirectCredential());
}
export async function loginGoogle() {
  console.log("logging in with google");
  return await app.auth.loginWithRedirect(new GoogleRedirectCredential());
}
export async function loginEmailPassword(email, password) {
  console.log("logging in with email/password");
  return await app.auth.loginWithCredential(
    new UserPasswordCredential(email, password),
  );
}
function getEmailPasswordClient() {
  return app.auth.getProviderClient(
    UserPasswordAuthProviderClient.factory,
    "local-userpass",
  );
}
export async function registerEmailPasswordUser(email, password) {
  console.log("registering email/password user");
  const emailPasswordAuth = getEmailPasswordClient();
  return await emailPasswordAuth.registerWithEmail(email, password);
}
export async function confirmEmailPasswordUser() {
  console.log("confirming email/password user");
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const tokenId = urlParams.get("tokenId");
  const emailPasswordAuth = getEmailPasswordClient();
  return await emailPasswordAuth.confirmUser(token, tokenId);
}
export function hasLoggedInUser() {
  return app.auth.isLoggedIn;
}
export function getCurrentUser() {
  return app.auth.isLoggedIn ? app.auth.user : null;
}
export const handleOAuthRedirects = async () => {
  if (app.auth.hasRedirectResult()) {
    console.log("hasRedirectResult - true");
    const user = await app.auth.handleRedirectResult();
    return user;
  } else {
    console.log("hasRedirectResult - false");
    return getCurrentUser();
  }
};
export async function logout() {
  const { user } = app.auth;
  return user && app.auth.logoutUserWithId(user.id);
}
export function addAuthenticationListener(listener) {
  console.log("adding auth listener", listener);
  app.auth.addAuthListener(listener);
}
export function removeAuthenticationListener(listener) {
  console.log("removing auth listener", listener);
  app.auth.removeAuthListener(listener);
}
export function logCurrentStitchUser() {
  console.log("current stitch user:", app.auth.currentUser);
}

/**
 * MongoDB
 */
const mongodb = app.getServiceClient(
  RemoteMongoClient.factory,
  "mongodb-atlas",
);

export const chatrooms = mongodb.db("chat").collection("rooms");

export function getChatrooms() {
  return chatrooms.find({}).toArray();
}

export async function searchForChatrooms(searchText) {
  const searchRegex = new BSON.BSONRegExp(`${searchText}`, "i");
  const rooms = await chatrooms
    .find({
      isPublic: true,
      name: searchRegex,
    })
    .toArray();
  return rooms;
}

export function getChatroomsUserIsIn() {
  if (app.auth.currentUser) {
    return chatrooms
      .find({ members: app.auth.currentUser.id }, { sort: { isArchived: 1 } })
      .toArray();
  } else {
    return [];
  }
}

export async function addUserToRoom(user_id, room_id) {
  console.log(`adding user(${user_id}) to room(${room_id})`);
  const result = await chatrooms.findOneAndUpdate(
    { _id: room_id },
    { $addToSet: { members: user_id } },
    { returnNewDocument: true },
  );
  return result;
}
export async function removeUserFromRoom(user_id, room_id) {
  console.log(`removing user(${user_id}) from room(${room_id})`);
  const result = await chatrooms.findOneAndUpdate(
    { _id: room_id },
    { $pullAll: { members: [user_id] } },
    { returnNewDocument: true },
  );
  return result;
}

export async function createChatroom({ name }) {
  const currentUserId = app.auth.currentUser.id;
  const room = {
    name: name,
    owner_id: currentUserId,
    administrators: [currentUserId],
    members: [currentUserId],
    messages: [],
    isArchived: false,
    isPublic: true,
  };
  const result = await chatrooms.insertOne(room);
  return { ...room, _id: result.insertedId };
}

export function watchChatrooms(chatroom_ids) {
  const getStream = chatrooms.watch(chatroom_ids);
  const closeStream = () => getStream.then(stream => stream.close());
  return [getStream, closeStream];
}

export function archiveChatroom(room_id) {
  return chatrooms.updateOne({ _id: room_id }, { $set: { isArchived: true } });
}

export function addMessageToRoom(message, room_id) {
  return chatrooms.updateOne(
    { _id: room_id },
    { $push: { messages: message } },
  );
}
