import React, { useState } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useSelector } from "react-redux";
import { getOptimizedProfilePhoto } from "../utils/imageOptimizer";

const Message = () => {
  const { selectedUser, onlineUsers } = useSelector((store) => store.user);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isOnline = onlineUsers?.includes(selectedUser?._id);

  return (
    <>
      {selectedUser !== null ? (
        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full">
          {/* Fixed Header */}
          <div className="flex gap-2 sm:gap-3 items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 sm:p-4 rounded-t-lg sticky top-0 z-10 shadow-md">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white ring-2 ring-offset-2 ring-offset-indigo-600 ring-white bg-gray-200 dark:bg-gray-700">
                {/* {!imageLoaded && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="loading loading-spinner loading-xs text-white"></div>
                  </div>
                )} */}
                <img
                  src={
                    selectedUser?.profilePhoto
                      ? getOptimizedProfilePhoto(selectedUser.profilePhoto, 150) || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser?.fullName || "User")}&background=6366f1&color=fff&size=128`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser?.fullName || "User")}&background=6366f1&color=fff&size=128`
                  }
                  alt="user profile"
                  className={`object-cover w-full h-full ${imageLoaded ? 'block' : 'hidden'}`}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></span>
              )}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-base sm:text-lg font-semibold truncate">{selectedUser?.fullName}</p>
              <p className="text-xs sm:text-sm text-indigo-100 truncate">
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          {/* Scrollable Messages */}
          <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
            <Messages />
          </div>

          {/* Fixed Send Input */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 sticky bottom-0 z-10">
            <SendInput />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-center px-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Welcome to Chatly!
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500">
              Select a user from the sidebar to start chatting
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
