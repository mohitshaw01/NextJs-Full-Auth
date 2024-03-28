import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbconnect = async () => {
  try {
    const url = process.env.MONGODB_URL;
    if (!url) {
      throw new Error(
        "MONGODB_URL is not defined in the environment variables"
      );
    }
    const connectionInstance = await mongoose.connect(url);
    console.log(connectionInstance);
    const connection = mongoose.connection;
    connection.on("error", (error) => {
      console.log(error + "Error connecting to MongoDB");
      process.exit();
    });
  } catch (error) {
    console.log(error + "Error connecting to MongoDB");
  }
};

export default dbconnect;
