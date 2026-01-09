import React, { useState, useEffect } from "react";
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
  const [isDark, setIsDark] = useState(false);

  // Initialize theme on component mount
  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Apply theme
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      setIsDark(false);
    }
    
    // Save preference to localStorage
    localStorage.setItem('theme', newTheme);
  };
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
    <div className="bg-base-100 dark:bg-gray-900 dark:text-white shadow-sm fixed top-0 left-0 right-0 z-50">
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
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            aria-label="Toggle theme"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              // Sun icon for light mode
              <svg
                className="w-5 h-5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5 12a7 7 0 1114 0 7 7 0 01-14 0zm14.5 0a.75.75 0 001.5 0 9 9 0 10-9 9 .75.75 0 000-1.5 7.5 7.5 0 017.5-7.5z" />
              </svg>
            ) : (
              // Moon icon for dark mode
              <svg
                className="w-5 h-5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64 13.64A9 9 0 1110.36 2.36 9 9 0 0021.64 13.64z" />
              </svg>
            )}
          </button>

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
              {/* <Link to="/" className="btn btn-sm btn-outline rounded-md">
                Home
              </Link> */}
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
