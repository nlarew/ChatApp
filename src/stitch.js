// import {  } from "mongodb-stitch-browser-sdk";

/**
 * App Client Initialization - Connect to Stitch!
 */

// const APP_ID = "";
// const app =

/**
 * Authentication
 */

// General Authentication Methods & Properties
export async function loginAnonymous() {}
export async function logout() {}
export function hasLoggedInUser() {}
export function getCurrentUser() {}

export function addAuthenticationListener(listener) {}
export function removeAuthenticationListener(listener) {}

// OAuth 2.0 Login Methods
export async function loginFacebook() {}
export async function loginGoogle() {}
export function handleOAuthRedirects() {};

// Email/Password Authentication Methods
export async function loginEmailPassword(email, password) {}
function getEmailPasswordClient() {}
export async function registerEmailPasswordUser(email, password) {}
export async function resendConfirmationEmail(email) {}
export async function confirmEmailPasswordUser() {}

/**
 * MongoDB
 */

// Stitch MongoDB Service Client for our cluster

// Collection that contains chatroom documents

export async function getChatroomsUserIsIn() {}
export async function searchForChatrooms(searchText) {}
export function watchChatrooms(chatroom_ids) {}

// Chatroom/Messages CRUD
export async function createChatroom(name) {}
export function addMessageToRoom(message, room_id) {}
export async function addUserToRoom(user_id, room_id) {}
export async function removeUserFromRoom(user_id, room_id) {}
