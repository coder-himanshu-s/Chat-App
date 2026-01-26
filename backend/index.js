// index.js
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/db/index.js";
import userRoutes from "./src/routes/user.routes.js";
import messageRoutes from "./src/routes/message.routes.js";
import { app, server } from "./socket/socket.js";
import express from "express";
import uploadRoutes from "./src/routes/upload.routes.js";
import errorHandler from "./src/middlewares/error.middleware.js";
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allow localhost/127.0.0.1 on any port and production URL
const allowedOriginPatterns = [
  /^https:\/\/chat-app-2-l366\.onrender\.com$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. Postman, mobile apps, same-origin)
    if (!origin) return callback(null, true);
    const allowed = allowedOriginPatterns.some((p) => p.test(origin));
    if (allowed) return callback(null, true);
    callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/upload", uploadRoutes);
app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("Hello this is home to your server");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
  connectDB();
});