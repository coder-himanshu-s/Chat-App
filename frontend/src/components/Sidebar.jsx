import React, { useState } from "react";
import { ImSearch } from "react-icons/im";
import OtherUsers from "./OtherUsers";
import axios from "axios";
import Toast, { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthUser, setOtherUsers, setSelectedUser } from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice";

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const { otherUsers } = useSelector((store) => store.user);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    const res = await axios.get( `${API_URL}/api/v1/user/logout`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      withCredentials: true,
    });
    if (res.data.success) {
      // 1. Clear localStorage
      localStorage.removeItem("accessToken");
      // 2. Clear redux user state
      dispatch(setAuthUser(null));
      dispatch(setOtherUsers(null));
      dispatch(setSelectedUser(null))
      dispatch(setMessages([]))
      // 3. Navigate to login page
      navigate("/login");
      // 4. Toast success
      Toast.success("Logged out successfully!");
    } else {
      Toast.error(res.data.message || "Logout failed!");
    }
  };

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    const usersArray = Array.isArray(otherUsers) ? otherUsers : [otherUsers];
    const chatUser = usersArray?.find((user) =>
      user?.fullName?.toLowerCase().includes(search.toLowerCase())
    );
    if (chatUser) {
      dispatch(setOtherUsers(chatUser));
    } else {
      toast.error("User not found!");
    }
  };

  return (
    <div className="h-full flex flex-col border-r border-slate-500 p-4">
      {/* Fixed Search Bar at the Top */}
      <form onSubmit={searchSubmitHandler} className="flex items-center gap-2 mb-2">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered rounded-full w-full"
        />
        <button type="submit" className="btn bg-slate-500">
          <ImSearch className="w-5 h-5" />
        </button>
      </form>

      <div className="divider my-2" />

      {/* Scrollable User List (fills all available space) */}
      <div className="flex-1 o">
        <OtherUsers />
      </div>

      {/* Fixed Logout Button at the Bottom */}
      <div className="mb-3 mt-2">
        <button className="btn btn-md w-full btn-secondary" onClick={logoutHandler}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
