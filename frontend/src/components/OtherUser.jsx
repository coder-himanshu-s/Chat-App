import React from "react";
import { setSelectedUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

const OtherUser = ({ user }) => {
  const dispatch = useDispatch();
  const { selectedUser, onlineUsers } = useSelector((store) => store.user);
  const isOnline = onlineUsers?.includes(user?._id);

  const selectedUserHandler = (user) => {
    dispatch(setSelectedUser(user));
  };

  return (
    <>
      <div
        onClick={() => selectedUserHandler(user)}
        className={`flex gap-3 items-center hover:bg-zinc-400 rounded-sm p-2 cursor-pointer ${
          selectedUser?._id === user?._id ? "bg-zinc-400" : ""
        }`}
      >
        <div className="relative">
          {isOnline && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white z-10"></span>
          )}
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={
                user?.profilePhoto ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxo2NFiYcR35GzCk5T3nxA7rGlSsXvIfJwg&s"
              }
              alt="user profile"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex justify-between gap-3">
            <p
              className={`font-medium ${
                isOnline ? "text-lg text-500" : "text-gray-800 dark:text-gray-900"
              }`}
            >
              {user?.fullName}
            </p>
            {isOnline && (
              <span className="text-md text-dark-600 font-semibold">Online</span>
            )}
          </div>
        </div>
      </div>
      <div className="divider py-0 my-0 h-1"></div>
    </>
  );
};

export default OtherUser;
