import express from "express";
import connectToMongo from "./db/connectToMongo.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth-routes.js";
import messageRoutes from "./routes/messages-routes.js";
import usersRoutes from "./routes/user-routes.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", usersRoutes);

app.listen(PORT, () => {
  connectToMongo();
  console.log(`server started port - ${PORT}`);
});
