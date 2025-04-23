import express from "express";
import connectDB from "./src/db/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

import userRoutes from "./src/routes/user.routes.js";
import messageRoutes from "./src/routes/message.routes.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));


app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello this is home to your server");
});

app.listen(PORT, () => {
  console.log(`Server is listeing on PORT ${PORT}`);
  connectDB();
});
