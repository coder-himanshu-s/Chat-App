import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();
const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log(`Db connected successfully`);
    })
    .catch((e) => {
      console.log(`Error in Db connection ${e}`);
    });
};

export default connectDB;
