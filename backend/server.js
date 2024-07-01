import express from "express";
import connectToMongo from "./db/connectToMongo.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth-routes.js";
import messageRoutes from "./routes/messages-routes.js";
import usersRoutes from "./routes/user-routes.js";
import { app, server } from "./socket/socket.js";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use(cors());

app.get("/", (req, res) => {
  res.redirect("/login");
});
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", usersRoutes);

server.listen(PORT, () => {
  connectToMongo();
  console.log(`server started port - ${PORT}`);
});
