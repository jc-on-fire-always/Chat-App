import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected MONGO");
  } catch (error) {
    console.log("error connecting to db");
  }
};

export default connectToMongo;
