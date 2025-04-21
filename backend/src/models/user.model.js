import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
  },
  userName: {
    type: String,
    required: [true, "User name is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password must be at least 8 characters"],
    select: false,
  },
  profilePhoto: {
    type: String,
    default:
      "URL_ADDRESS.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
    required: [true, "Gender is required"],
  },
},{timestamps:true});

export const User = mongoose.model("User", userSchema);
