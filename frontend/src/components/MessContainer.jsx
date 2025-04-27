import React from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";

const Message = () => {
  return (
    <div className="md-min-w-[550] flex-col">
      <div className="flex gap-3 items-center bg-zinc-800 text-white px-4 mb-2">
        <div className="avatar online">
          <div className="w-14 rounded-full">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxo2NFiYcR35GzCk5T3nxA7rGlSsXvIfJwg&s"
              alt="user profile"
            />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between  gap-3 ">
            <p>Peter</p>
          </div>
        </div>
      </div>
      <Messages/>
      <SendInput/>
    </div>
  );
};

export default Message;
