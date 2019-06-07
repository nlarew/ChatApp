import {
  Stitch,
  AnonymousCredential,
  FacebookRedirectCredential,
  GoogleRedirectCredential,
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
export async function loginGoogle() {
  return await app.auth.loginWithRedirect(new GoogleRedirectCredential());
}
export function hasLoggedInUser() {
  return app.auth.isLoggedIn;
}
export function getCurrentUser() {
  return app.auth.isLoggedIn ? app.auth.user : null;
}
export async function handleOAuthRedirects() {
  if (app.auth.hasRedirectResult()) {
    console.log("hasRedirectResult");
    const user = await app.auth.handleRedirectResult();
    console.log("hasRedirectResult - user", user);
  } else {
    console.log("!hasRedirectResult");
    return getCurrentUser();
  }
}
export async function logout() {
  const { currentUser } = app.auth;
  return currentUser && (await app.auth.logoutUserWithId(currentUser.id));
}
export async function logCurrentStitchUser() {
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
  try {
    const result = await chatrooms.insertOne(room);
    return { ...room, _id: result.insertedId };
  } catch (err) {
    console.error(err);
    return false;
  }
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
