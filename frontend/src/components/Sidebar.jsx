import React, { useState } from "react";
import { ImSearch } from "react-icons/im";
import OtherUsers from "./OtherUsers";
import axios from "axios";
import Toast, { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthUser, setOtherUsers, setSelectedUser } from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice";

const Sidebar = ({ onUserSelect }) => {
  const [search, setSearch] = useState("");
  const { authUser ,otherUsers } = useSelector((store) => store.user);
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
    if (!search.trim()) {
      // If search is empty, fetch all users again
      const fetchAllUsers = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/v1/user/other`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            withCredentials: true,
          });
          dispatch(setOtherUsers(res.data.data));
        } catch (error) {
          console.log(error);
        }
      };
      fetchAllUsers();
      return;
    }
    
    const usersArray = Array.isArray(otherUsers) ? otherUsers : [];
    const filteredUsers = usersArray?.filter((user) =>
      user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      user?.userName?.toLowerCase().includes(search.toLowerCase())
    );
    
    if (filteredUsers && filteredUsers.length > 0) {
      dispatch(setOtherUsers(filteredUsers));
    } else {
      toast.error("User not found!");
    }
  };

  return (
    <div className="h-full flex flex-col border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Fixed Search Bar at the Top */}
      <div className="p-3 sm:p-4 border-b border-gray-300 dark:border-gray-700">
        <form onSubmit={searchSubmitHandler} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered rounded-lg w-full text-sm dark:bg-gray-700 dark:text-white"
          />
          <button 
            type="submit" 
            className="btn btn-sm btn-primary rounded-lg"
            title="Search"
          >
            <ImSearch className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Scrollable User List (fills all available space) */}
      <div className="flex-1 overflow-hidden">
        <OtherUsers onUserSelect={onUserSelect} />
      </div>

      {/* Fixed Logout Button at the Bottom */}
     { authUser && <div className="p-3 sm:p-4 border-t border-gray-300 dark:border-gray-700">
        <button 
          className="btn btn-sm sm:btn-md w-full btn-error rounded-lg" 
          onClick={logoutHandler}
        >
          Log Out
        </button>
      </div>}
    </div>
  );
};

export default Sidebar;
