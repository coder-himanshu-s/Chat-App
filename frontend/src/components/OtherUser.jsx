import React from "react";
import { setSelectedUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

const OtherUser = ({ user }) => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.user);
  const selectedUserHandler = (user) => {
    // console.log(user);
    dispatch(setSelectedUser(user));
  };
  return (
    <>
      <div
        onClick={() => selectedUserHandler(user)}
        className={` ${selectedUser?._id === user?._id ? 'bg-zinc-400': "" }flex gap-3 items-center hover:bg-zinc-400 rounded-sm p-p2 cursor-pointer`}
      >
        <div className="avatar online">
          <div className="w-14 rounded-full">
            <img
              src={
                user?.profilePhoto ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxo2NFiYcR35GzCk5T3nxA7rGlSsXvIfJwg&s"
              }
              alt="user profile"
            />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between  gap-3 ">
            <p>{user?.fullName}</p>
          </div>
        </div>
      </div>
      <div className="divider py-0 my-0 h-1"> </div>
    </>
  );
};

export default OtherUser;
