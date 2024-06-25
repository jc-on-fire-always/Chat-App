import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import Conversation from "../models/conv-model.js";
import Message from "../models/message-model.js";

const router = express.Router();

router.post("/send/:id", protectRoute, async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let conv = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conv) {
      conv = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conv.messages.push(newMessage._id);
    }

    await Promise.all([conv.save(), newMessage.save()]);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", protectRoute, async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conv = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conv) {
      return res.status(200).json([]);
    }
    res.status(200).json(conv.messages);
  } catch (error) {
    console.log("Error in getMessages route", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
