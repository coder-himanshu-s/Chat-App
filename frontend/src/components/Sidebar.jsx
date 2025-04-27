import React from "react";
import { ImSearch } from "react-icons/im";
import OtherUsers from "./OtherUsers";
import axios from "axios";
import Toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "../redux/userSlice";
const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    const res = await axios.get("http://localhost:3000/api/v1/user/logout", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      withCredentials: true,
    });
    console.log(res);
    if (res.data.success) {
      // 1. Clear localStorage
      localStorage.removeItem("accessToken");
      // 2. Clear redux user state
      dispatch(setAuthUser(null));
      // 3. Navigate to login page
      navigate("/login");
      // 4. Toast success
      Toast.success("Logged out successfully!");
    } else {
      Toast.error(res.data.message || "Logout failed!");
    }
  };
  return (
    <div className="border-r border-slate-500 p-4 ">
      <form action="" className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered rounded-full"
        />
        <button type="submit" className="btn bg-slate-500">
          <ImSearch className="width-6 height-6 outline-none" />
        </button>
      </form>
      <div className="divider px-3"> </div>
      <OtherUsers />
      <div className="mt-2">
        <button className="btn btn-sm" onClick={logoutHandler}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
