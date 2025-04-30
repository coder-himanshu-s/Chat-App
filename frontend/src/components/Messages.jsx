import React, { useEffect } from "react";
import Message from "./Message";
import useGetMessages from "../hooks/useGetMessages";
import { useSelector } from "react-redux";

const Messages = () => {
  useGetMessages();
  const { messages } = useSelector((store) => store.message);
  // const { selectedUser } = useSelector((store) => store.user);
  console.log(messages);
  if (!messages) return;

  return (
    <div className="px-4 flex-1 overflow-auto">
      {messages && messages.map((message, index) => {
        return <Message key={index} message={message} />;
      })}
    </div>
  );
};

export default Messages;
