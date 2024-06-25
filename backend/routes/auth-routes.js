import express, { json } from "express";
import bcryptjs from "bcryptjs";
import User from "../models/user-model.js";
import genTokenandSetCookie from "../utils/genJWT.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { fullName, userName, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(404).json({ error: "password do not match" });
    }

    const user = await User.findOne({ userName });

    if (user) {
      return res.status(400).json({ error: "username already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPass = await bcryptjs.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?userName=${userName}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?userName=${userName}`;

    const newUser = new User({
      fullName,
      userName,
      password: hashedPass,
      confirmPassword,
      gender,
      ProfilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      genTokenandSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        ProfilePic: newUser.ProfilePic,
      });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    const isPassCorrect = await bcryptjs.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPassCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    genTokenandSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      ProfilePic: user.ProfilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
