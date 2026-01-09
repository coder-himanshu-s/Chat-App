import React, { useState } from "react";
import { setSelectedUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { getOptimizedProfilePhoto } from "../utils/imageOptimizer";

const OtherUser = ({ user, onUserSelect }) => {
  const dispatch = useDispatch();
  const { selectedUser, onlineUsers } = useSelector((store) => store.user);
  const isOnline = onlineUsers?.includes(user?._id);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const selectedUserHandler = (user) => {
    dispatch(setSelectedUser(user));
    if (onUserSelect) {
      onUserSelect();
    }
  };

  return (
    <div
      onClick={() => selectedUserHandler(user)}
      className={`flex gap-2 sm:gap-3 items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors p-2 sm:p-3 cursor-pointer border-b border-gray-200 dark:border-gray-700 ${
        selectedUser?._id === user?._id 
          ? "bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-l-indigo-600" 
          : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 z-10"></span>
        )}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-gray-200 dark:ring-gray-700 bg-gray-200 dark:bg-gray-700">
          {/* {!imageLoaded && !imageError && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="loading loading-spinner loading-xs"></div>
            </div>
          )} */}
          <img
            className={`w-full h-full object-cover ${imageLoaded ? 'block' : 'hidden'}`}
            src={
              user?.profilePhoto
                ? getOptimizedProfilePhoto(user.profilePhoto, 100) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "User")}&background=6366f1&color=fff&size=128`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "User")}&background=6366f1&color=fff&size=128`
            }
            alt="user profile"
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <p
            className={`font-medium text-sm sm:text-base truncate ${
              selectedUser?._id === user?._id
                ? "text-indigo-700 dark:text-indigo-300"
                : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {user?.fullName}
          </p>
          {isOnline && (
            <span className="text-xs text-green-600 dark:text-green-400 font-semibold flex-shrink-0">
              ●
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          @{user?.userName}
        </p>
      </div>
    </div>
  );
};

export default OtherUser;
