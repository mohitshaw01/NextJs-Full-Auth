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
    if(!connectionInstance){
      throw new Error("Error connecting to MongoDB")
    }
    const connection = mongoose.connection;
    connection.on('connected', () => {
      console.log('MongoDB connected successfully');
  })
  } catch (error) {
    console.log(error + "Error connecting to MongoDB");
  }
};

export default dbconnect;
