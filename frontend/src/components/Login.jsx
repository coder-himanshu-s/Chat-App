import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAuthUser } from "../redux/userSlice";

const Signup = () => {
  const [user, setUser] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
  });
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  // console.log(import.meta.env.VITE_API_URL)
  console.log("from login",API_URL);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      toast.error("Password and confirm password do not match");
      return;
    }

    try {
      const res = await axios.post(
         `${API_URL}/api/v1/user/login`,
        user,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem("accessToken", res.data.data.accessToken);
        console.log("from login.jsx",res?.data)
        dispatch(setAuthUser(res.data.data.user));
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="flex-auto">
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200 dark:from-gray-800 dark:to-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 dark:text-white mb-6">
          Log In
        </h1>
        <form onSubmit={onSubmitHandler}>

          {/* Username */}
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-gray-700 dark:text-gray-300 text-base sm:text-lg">
                Username
              </span>
            </label>
            <input
              type="text"
              placeholder="_peter12"
              value={user.userName}
              onChange={(e) => setUser({ ...user, userName: e.target.value })}
              className="input input-bordered input-primary w-full dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-gray-700 dark:text-gray-300 text-base sm:text-lg">
                Password
              </span>
            </label>
            <input
              type="password"
              placeholder="********"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="input input-bordered input-primary w-full dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-gray-700 dark:text-gray-300 text-base sm:text-lg">
                Confirm Password
              </span>
            </label>
            <input
              type="password"
              placeholder="********"
              value={user.confirmPassword}
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              className="input input-bordered input-primary w-full dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            Don't have an account?
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
              Sign Up
            </Link>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full rounded-md text-white shadow hover:shadow-lg text-sm sm:text-base"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
    </div>
    
  );
};

export default Signup;
