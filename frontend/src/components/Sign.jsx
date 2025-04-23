import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    userName: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const navigate = useNavigate();
  const handleCheck = (gender) => {
    setUser({ ...user, gender: gender });
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log(`request is going with data`, user);
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/register",
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
        navigate("/login")
      }else{
        toast.error(res.data.message);
      }
      setUser({
        fullName: "",
        userName: "",
        password: "",
        confirmPassword: "",
        gender: "",
      })
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
          Sign Up
        </h1>
        <form onSubmit={onSubmitHandler}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-base sm:text-lg text-gray-700">
                Full Name
              </span>
            </label>
            <input
              className="w-full input input-bordered input-primary text-sm sm:text-base"
              type="text"
              placeholder="Peter Parker"
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
            />
          </div>

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
              minLength={6}
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
              minLength={6}
              value={user.confirmPassword}
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
            />
          </div>

          {/* Gender */}
          <div className="mb-6">
            <span className="label-text text-base sm:text-lg text-gray-700 mb-2 block">
              Gender
            </span>
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
              <label className="label cursor-pointer flex items-center space-x-2">
                <span className="text-blue-700 font-medium">Male</span>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  className="radio radio-info"
                  onChange={() => handleCheck("Male")}
                />
              </label>
              <label className="label cursor-pointer flex items-center space-x-2">
                <span className="text-pink-600 font-medium">Female</span>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  className="radio radio-info"
                  onChange={() => handleCheck("Female")}
                />
              </label>
              <label className="label cursor-pointer flex items-center space-x-2">
                <span className="text-purple-700 font-medium">Others</span>
                <input
                  type="radio"
                  name="gender"
                  value="Others"
                  className="radio radio-info"
                  onChange={() => handleCheck("Others")}
                />
              </label>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mb-4">
            Already have an account?
            <Link to="/login" className="text-blue-600 hover:underline ml-1">
              Login
            </Link>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full rounded-md shadow hover:shadow-lg text-sm sm:text-base"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
