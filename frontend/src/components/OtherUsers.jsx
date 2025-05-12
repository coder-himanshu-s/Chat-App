import React from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";

const OtherUsers = () => {
  useGetOtherUsers();
  const {otherUsers} = useSelector(store=>store.user)
  const usersArray = Array.isArray(otherUsers) ? otherUsers : [otherUsers];
  console.log("otherUsers from otherUsers.jsx");
  console.log(otherUsers);
  if( !otherUsers){
    return <div>No users found</div>
  }

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-12rem)] border border-gray-300 rounded-md shadow-sm bg-gray-500">
      {
        usersArray && usersArray?.map((user)=>{
          return(
            <OtherUser key={user._id} user={user}/>
          )
        })
      }
    </div>

  );
};

export default OtherUsers;
