import { useState, useEffect } from "react";
import * as R from "ramda";

import { getChatrooms, watchChatrooms } from "./../stitch";

function getRoomIds() {
  return getChatrooms().then(R.map(room => room._id));
}

export function useWatchChatrooms() {
  const [isLoading, setIsLoading] = useState(true);
  const [roomIds, setRoomIds] = useState([]);
  const [rooms, setRooms] = useState([]);
  console.log("rooms", rooms);
  // Populate our list of room ids
  const updateRoomIds = () => getRoomIds().then(setRoomIds);
  useEffect(() => {
    updateRoomIds();
    getChatrooms().then(setRooms);
  }, []);
  // Open a stream of new messages
  useEffect(() => {
    if (roomIds.length > 0) {
      console.log("starting stream");
      const [getStream, closeStream] = watchChatrooms(roomIds);
      getStream.then(stream => {
        console.log("got stream");
        stream.onNext(({ fullDocument: room }) => {
          console.log("onNext fired for", room);
          const findRoomIndex = R.findIndex(R.propEq("_id", room._id));
          setRooms(rooms => R.adjust(findRoomIndex(rooms), () => room, rooms));
        });
      });
      return closeStream;
    }
  }, [roomIds]);

  const addRoom = room => {
    setRooms([...rooms, room]);
    setRoomIds([...roomIds, room._id]);
  };

  return [rooms, addRoom];
}
