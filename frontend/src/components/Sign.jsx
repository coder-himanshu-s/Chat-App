import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    userName: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false); // <-- Loading state added

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleCheck = (gender) => {
    setUser({ ...user, gender });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    // Check for empty fields
    if (!user.fullName || !user.userName || !user.password || !user.confirmPassword || !user.gender) {
      toast.error("All fields are required!");
      return;
    }

    if (user.password !== user.confirmPassword) {
      toast.error("Password and Confirm Password do not match!");
      return;
    }

    setLoading(true); // Start loading

    try {
      const res = await axios.post(
        `${API_URL}/api/v1/user/register`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("from signup", res);
      
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login"); // Navigate to login after successful registration
      } else {
        toast.error(res.data.error || "Something went wrong");
      }
    } catch (error) {
      console.log("Error:", error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="flex-auto">
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200 dark:from-gray-800 dark:to-gray-900 px-4 py-8">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 dark:text-white mb-6">
            Sign Up
          </h1>
          <form onSubmit={onSubmitHandler} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="label">
                <span className="label-text text-base sm:text-lg text-gray-700 dark:text-gray-300">
                  Full Name
                </span>
              </label>
              <input
                className="w-full input input-bordered input-primary text-sm sm:text-base dark:bg-gray-700 dark:text-white"
                type="text"
                placeholder="Peter Parker"
                value={user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="label">
                <span className="label-text text-base sm:text-lg text-gray-700 dark:text-gray-300">
                  Username
                </span>
              </label>
              <input
                className="w-full input input-bordered input-primary text-sm sm:text-base dark:bg-gray-700 dark:text-white"
                type="text"
                placeholder="_peter12"
                value={user.userName}
                onChange={(e) => setUser({ ...user, userName: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="label">
                <span className="label-text text-base sm:text-lg text-gray-700 dark:text-gray-300">
                  Password
                </span>
              </label>
              <input
                className="w-full input input-bordered input-primary text-sm sm:text-base dark:bg-gray-700 dark:text-white"
                type="password"
                placeholder="********"
                value={user.password}
                minLength={6}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">
                <span className="label-text text-base sm:text-lg text-gray-700 dark:text-gray-300">
                  Confirm Password
                </span>
              </label>
              <input
                className="w-full input input-bordered input-primary text-sm sm:text-base dark:bg-gray-700 dark:text-white"
                type="password"
                placeholder="********"
                minLength={6}
                value={user.confirmPassword}
                onChange={(e) =>
                  setUser({ ...user, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            {/* Gender */}
            <div>
              <span className="label-text text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-2 block">
                Gender
              </span>
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                <label className="label cursor-pointer flex items-center space-x-2">
                  <span className="text-blue-700 dark:text-blue-400 font-medium">Male</span>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    className="radio radio-info"
                    checked={user.gender === "Male"}
                    onChange={() => handleCheck("Male")}
                  />
                </label>
                <label className="label cursor-pointer flex items-center space-x-2">
                  <span className="text-pink-600 dark:text-pink-400 font-medium">Female</span>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    className="radio radio-info"
                    checked={user.gender === "Female"}
                    onChange={() => handleCheck("Female")}
                  />
                </label>
                <label className="label cursor-pointer flex items-center space-x-2">
                  <span className="text-purple-700 dark:text-purple-400 font-medium">Others</span>
                  <input
                    type="radio"
                    name="gender"
                    value="Others"
                    className="radio radio-info"
                    checked={user.gender === "Others"}
                    onChange={() => handleCheck("Others")}
                  />
                </label>
              </div>
            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
              Already have an account?
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                Login
              </Link>
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-full rounded-md text-white shadow-lg hover:shadow-xl text-sm sm:text-base font-semibold py-3 mt-4 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
