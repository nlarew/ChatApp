import { useState, useEffect } from "react";
import { useStitchAuth } from "./StitchAuth";
import * as R from "ramda";

import { watchChatrooms, getChatroomsUserIsIn } from "./../stitch";

export function useChatrooms() {
  const [rooms, setRooms] = useState([]);
  const addRoom = room => {
    setRooms([...rooms, room]);
  };

  // Update whenever a new user logs in
  const { currentUser } = useStitchAuth();
  useEffect(() => {
    if (currentUser) {
      getChatroomsUserIsIn().then(setRooms)
    }
  }, [currentUser]);

  return [rooms, { addRoom }];
}

export function useWatchChatrooms() {
  const [rooms, setRooms] = useState([]);
  const [roomIds, setRoomIds] = useState([]);
  const addRoom = room => {
    setRooms([...rooms, room]);
    setRoomIds([...roomIds, room._id]);
  };
  const clearRooms = () => {
    setRooms([]);
    setRoomIds([]);
  };
  async function updateRooms() {
    const rooms = await getChatroomsUserIsIn();
    const roomIds = rooms.map(room => room._id);
    setRooms(rooms);
    setRoomIds(roomIds);
  }
// Update whenever a new user logs in
  const { currentUser } = useStitchAuth();
  useEffect(() => {
    if (currentUser) {
      getChatroomsUserIsIn().then(rooms => {
        const roomIds = rooms.map(room => room._id);
        setRooms(rooms);
        setRoomIds(roomIds);
      })
    }
  }, [currentUser]);
  
  // Open a stream of new messages
  useEffect(() => {
    if (currentUser && roomIds.length > 0) {
      const [getStream, closeStream] = watchChatrooms(roomIds);
      getStream.then(stream => {
        stream.onNext(({ fullDocument: room, updateDescription }) => {
          const membersChanged =
            updateDescription.updatedFields &&
            Object.keys(updateDescription.updatedFields).includes("members");
          if (membersChanged) {
            updateRooms();
          } else {
            const findRoomIndex = R.findIndex(R.propEq("_id", room._id));
            setRooms(rooms => R.adjust(findRoomIndex(rooms), () => room, rooms));
          }
        });
      });
      return closeStream;
    }
  }, [roomIds, currentUser]);

  return [rooms, { addRoom, updateRooms, clearRooms }];
}
