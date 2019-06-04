import React, { useState, useEffect } from "react";

import { chatrooms } from "./../stitch";

async function getChatrooms() {
  // Server-side filters make sure we only
  // get rooms that the user is allowed to see.
  return await chatrooms.find({}).asArray();
}

export function useChatroom(chatroom_id) {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [chatroom, setChatroom] = useState({
    _id: "",
    owner_id: "",
    isPublic: true,
    isFinished: false,
    administrators: [],
    members: [],
  });
  // Open a stream of new messages
  useEffect(() => {
    const getStream = chatrooms.watch([chatroom_id]);
    getStream.then(stream => {
      stream.onNext(changeEvent => {
        const { fullDocument } = changeEvent;
        setMessages(fullDocument.messages);
      });
    });
    setIsLoading(false);
    return () => getStream.then(stream => stream.close());
  }, []);

  return { isLoading, messages };
}
