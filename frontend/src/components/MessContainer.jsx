import React, { useEffect } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";

const Message = () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => dispatch(setSelectedUser(null));
  }, []);

  return (
    <>
      {selectedUser ? (
        <div className="flex flex-col min-w-[350px] sm:min-w-[550px] bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full max-h-screen">
          {/* Fixed Header */}
          <div className="flex gap-3 items-center bg-zinc-800 text-white p-4 rounded-t-lg sticky top-0 z-10">
            <div className="avatar online">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700">
                <img
                  src={
                    selectedUser?.profilePhoto ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxo2NFiYcR35GzCk5T3nxA7rGlSsXvIfJwg&s"
                  }
                  alt="user profile"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-lg font-semibold">{selectedUser?.fullName}</p>
            </div>
          </div>

          {/* Scrollable Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-2 bg-gray-50 dark:bg-gray-900">
            <Messages />
          </div>

          {/* Fixed Send Input */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 sticky bottom-0 z-10">
            <SendInput />
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <h1 className="text-xl text-gray-600 dark:text-gray-400">
            Let's start a chat!
          </h1>
        </div>
      )}
    </>
  );
};

export default Message;
