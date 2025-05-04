import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";
import axios from "axios";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const handleLogout = async () => {
    try {
      const res = await axios.get( `${API_URL}/api/v1/user/logout`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        localStorage.removeItem("accessToken");
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success("Logged out successfully!");
      } else {
        toast.error("Logout failed!");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="bg-base-100 dark:bg-gray-900 dark:text-white shadow-sm sticky top-0 z-50">
      <div className="navbar container mx-auto px-4 min-h-[3.5rem] justify-between">
        {/* Logo */}
        <div>
          <Link to="/" className="text-xl font-bold">
            Chatly<span className="text-primary">.</span>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <label className="swap swap-rotate">
            <input
              type="checkbox"
              onChange={() => {
                const currentTheme = document.documentElement.getAttribute("data-theme");
                document.documentElement.setAttribute(
                  "data-theme",
                  currentTheme === "dark" ? "light" : "dark"
                );
              }}
            />
            {/* sun icon */}
            <svg
              className="swap-on fill-current w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5 12a7 7 0 1114 0 7 7 0 01-14 0zm14.5 0a.75.75 0 001.5 0 9 9 0 10-9 9 .75.75 0 000-1.5 7.5 7.5 0 017.5-7.5z" />
            </svg>
            {/* moon icon */}
            <svg
              className="swap-off fill-current w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64 13.64A9 9 0 1110.36 2.36 9 9 0 0021.64 13.64z" />
            </svg>
          </label>

          {!authUser ? (
            <>
              <Link to="/login" className="btn btn-sm btn-outline rounded-md">
                Login
              </Link>
              <Link to="/signup" className="btn btn-sm btn-primary rounded-md">
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="btn btn-sm btn-outline rounded-md">
                Home
              </Link>
              <button onClick={handleLogout} className="btn btn-sm btn-error rounded-md">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
