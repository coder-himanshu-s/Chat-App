import express from "express";
import {
  getCurrentUser,
  getOtherUsers,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(authenticate, getCurrentUser);
router.route("/other").get(authenticate, getOtherUsers);
export default router;
