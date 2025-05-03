import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Message = ({ message }) => {
  const scroll = useRef();
  const { authUser, selectedUser } = useSelector((store) => store.user);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // Format time
  const formattedTime = new Date(message?.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isSentByAuthUser = authUser?._id === message?.senderId;

  return (
    <div
      ref={scroll}
      className={`chat ${isSentByAuthUser ? "chat-end" : "chat-start"}`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="User avatar"
            src={
              isSentByAuthUser
                ? authUser?.profilePhoto
                : selectedUser?.profilePhoto
            }
          />
        </div>
      </div>

      <div className="chat-header text-sm text-gray-700 dark:text-gray-300">
        {isSentByAuthUser ? authUser?.fullName : selectedUser?.fullName}
        <time className="ml-2 text-xs opacity-60 dark:text-gray-400">
          {formattedTime}
        </time>
      </div>

      <div
        className={`chat-bubble ${
          isSentByAuthUser
            ? "bg-emerald-200 text-emerald-900 dark:bg-emerald-600 dark:text-white"
            : "bg-slate-100 text-gray-800 dark:bg-gray-700 dark:text-white"
        }`}
      >
        {message?.message}
      </div>

      <div className="chat-footer text-xs opacity-60 dark:text-gray-400">
        Delivered
      </div>
    </div>
  );
};

export default Message;
