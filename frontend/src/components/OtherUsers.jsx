import React from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";

const OtherUsers = ({ onUserSelect }) => {
  useGetOtherUsers();
  const { otherUsers, isLoadingUsers, authUser } = useSelector((store) => store.user);
  const usersArray = Array.isArray(otherUsers) ? otherUsers : [];

  // Show loading state
  if (isLoadingUsers) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <div className="loading loading-spinner loading-md text-indigo-600"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Loading users...</p>
        </div>
      </div>
    );
  }

  // Show empty state only after loading is complete
  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Please log in to see users</p>
      </div>
    );
  }

  if (usersArray.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center">No other users found</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full bg-white dark:bg-gray-800">
      {usersArray.map((user) => (
        <OtherUser key={user._id} user={user} onUserSelect={onUserSelect} />
      ))}
    </div>
  );
};

export default OtherUsers;
