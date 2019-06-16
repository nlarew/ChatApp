import { useState, useEffect } from "react";
import * as R from "ramda";

import { watchChatrooms, getChatroomsUserIsIn } from "./../stitch";

export function useWatchChatrooms() {
  const [rooms, setRooms] = useState([]);
  const [roomIds, setRoomIds] = useState([]);
  async function updateRooms() {
    const rooms = await getChatroomsUserIsIn();
    const roomIds = rooms.map(room => room._id);
    setRooms(rooms);
    setRoomIds(roomIds);
  }
  useEffect(() => {
    updateRooms();
  }, []);
  // Open a stream of new messages
  useEffect(() => {
    if (roomIds.length > 0) {
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
            setRooms(rooms =>
              R.adjust(findRoomIndex(rooms), () => room, rooms),
            );
          }
        });
      });
      return closeStream;
    }
  }, [roomIds]);

  const addRoom = room => {
    setRooms([...rooms, room]);
    setRoomIds([...roomIds, room._id]);
  };
  const clearRooms = () => {
    setRooms([]);
    setRoomIds([]);
  };

  return [rooms, { addRoom, updateRooms, clearRooms }];
}
