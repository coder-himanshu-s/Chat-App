import expres from "express";
import {
  getOtherUsers,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = expres.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/other").get( authenticate,getOtherUsers);
export default router;
