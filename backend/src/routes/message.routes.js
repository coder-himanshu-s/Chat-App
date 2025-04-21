import express from "express";
import { getMessage, sendMessage } from "../controllers/message.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/send/:id").post(authenticate, sendMessage);
router.route("/getm/:id").get(authenticate, getMessage)
export default router;
