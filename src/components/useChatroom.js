import { useState, useEffect } from "react";
import * as R from "ramda";
import useDebounce from "./useDebounce";

import {
  // getChatrooms,
  watchChatrooms,
  getChatroomsUserIsIn,
  searchForChatrooms,
} from "./../stitch";

export async function useChatroomSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    let didCancel = false;
    if (debouncedSearchTerm) {
      setIsSearching(true);
      searchForChatrooms(debouncedSearchTerm).then(results => {
        if (!didCancel) {
          setIsSearching(false);
          setResults(results);
        }
      });
    } else {
      setResults([]);
    }
    return () => {
      didCancel = true;
      setIsSearching(false);
    };
  }, [debouncedSearchTerm]);
}

export function useWatchChatrooms() {
  const [roomIds, setRoomIds] = useState([]);
  const [rooms, setRooms] = useState([]);
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
        stream.onNext(({ fullDocument: room }) => {
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

  return [rooms, { addRoom, updateRooms }];
}
