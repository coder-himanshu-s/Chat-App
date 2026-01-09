import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { io } from "../../socket/socket.js";

export const register = asyncHandler(async (req, res) => {
  const { fullName, userName, password, confirmPassword, gender } = req.body;
  if (!fullName || !userName || !password || !confirmPassword || !gender) {
    throw new ApiError(400, "All fields are required");
  }
  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password must be same");
  }
  const userExists = await User.findOne({ userName });
  if (userExists) {
    throw new ApiError(400, "User already exists . Please login");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
  const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${userName}`;
  const user = await User.create({
    fullName,
    userName,
    password: hashPassword,
    profilePhoto: gender === "Male" ? maleProfilePhoto : femaleProfilePhoto,
    gender,
  });
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  
  // Emit new user event to all connected clients
  io.emit("newUser", userWithoutPassword);
  
  return res
    .status(200)
    .json(new ApiResponse(200, userWithoutPassword, "User registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const userWithPass = await User.findOne({ userName }).select("+password");
  if (!userWithPass) {
    throw new ApiError(400, "User not found");
  }
  const isMatch = await bcrypt.compare(password, userWithPass.password);
  if (!isMatch) {
    throw new ApiError(400, "Enter valid credentials");
  }

  const accessToken = jwt.sign(
    { id: userWithPass._id },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "30m",
    }
  );
  const refreshToken = jwt.sign(
    { id: userWithPass._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "2d",
    }
  );
  const user = userWithPass.toObject();
  delete user.password;
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 2,
    }).cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 30,
    })
    .json(
      new ApiResponse(
        200,
        { accessToken, user },
        `Welcome ${user.userName}`
      )
    );
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(200).json(new ApiResponse(200, {}, "Logged out Successful"));
  }
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Logged Out Sucessfully"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  return res.status(200).json(new ApiResponse(200, userWithoutPassword, "User fetched successfully"));
});

export const getOtherUsers = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;
  const otherUsers = await User.find({ _id: { $ne: loggedInUserId } });
  return res.status(200).json(new ApiResponse(200, otherUsers, "All users"));
});
