import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import User from "../models/user-model.js";

const router = express.Router();

router.get("/", protectRoute, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const allUsersExceptUs = await User.find({
      _id: { $ne: loggedInUserId },
    })
      .select("-password")
      .select("-confirmPassword");

    res.status(200).json(allUsersExceptUs);
  } catch (error) {
    console.log("Error in getUsersinSideBar route", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
