import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/db/index.js";
import userRoutes from "./src/routes/user.routes.js";
import messageRoutes from "./src/routes/message.routes.js";
import { app, server } from "./socket/socket.js";
import express from "express";
import uploadRoutes from "./src/routes/upload.routes.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-app-2-l366.onrender.com",
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/upload", uploadRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.get("/", (req, res) => {
  res.send("Hello this is home to your server");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
  connectDB();
});
