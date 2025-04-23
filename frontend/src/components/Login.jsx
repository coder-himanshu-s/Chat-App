import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Signup = () => {
  const [user, setUser] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log(`request is going with data`, user);
      if (user?.password !== user?.confirmPassword) {
        toast.error("Password and confirm Password do not match");
        return;
      }
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/login",
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("Response:", res);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200 px-4 sm:px-6 lg:px-8">
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 backdrop-blur-sm bg-opacity-80 border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-6">
          Log In
        </h1>
        <form onSubmit={onSubmitHandler}>
          {/* Username */}
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-base sm:text-lg text-gray-700">
                Username
              </span>
            </label>
            <input
              className="w-full input input-bordered input-primary text-sm sm:text-base"
              type="text"
              placeholder="_peter12"
              value={user.userName}
              onChange={(e) => setUser({ ...user, userName: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-base sm:text-lg text-gray-700">
                Password
              </span>
            </label>
            <input
              className="w-full input input-bordered input-primary text-sm sm:text-base"
              type="password"
              placeholder="********"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-base sm:text-lg text-gray-700">
                Confirm Password
              </span>
            </label>
            <input
              className="w-full input input-bordered input-primary text-sm sm:text-base"
              type="password"
              placeholder="********"
              value={user.confirmPassword}
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
            />
          </div>

          <p className="text-center text-sm text-gray-600 mb-4">
            Already have an account?
            <Link to="/signup" className="text-blue-600 hover:underline ml-1">
              Sign Up
            </Link>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full rounded-md shadow hover:shadow-lg text-sm sm:text-base"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
