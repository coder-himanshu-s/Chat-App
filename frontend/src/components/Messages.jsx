import React, { useEffect } from "react";
import Message from "./Message";
import useGetMessages from "../hooks/useGetMessages";
import { useSelector } from "react-redux";
import useGetRealTimeMessage from "../hooks/useGetRealTimeMessage";

const Messages = () => {
  useGetMessages();
  useGetRealTimeMessage();

  const { messages } = useSelector((store) => store.message);

  if (!messages) return null;

  // Helper to format date as 'Today', 'Yesterday', or readable date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  let lastDate = null;

  return (
    <div className="px-4 flex-1 overflow-auto space-y-2">
      {messages.map((message, index) => {
        const messageDate = formatDate(message.createdAt);
        const showDateSeparator = messageDate !== lastDate;
        lastDate = messageDate;

        return (
          <div key={message._id || index}>
            {showDateSeparator && (
              <div className="flex justify-center my-2">
                <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100 px-3 py-1 rounded-full text-sm shadow">
                  {messageDate}
                </span>
              </div>
            )}
            <Message message={message} />
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
