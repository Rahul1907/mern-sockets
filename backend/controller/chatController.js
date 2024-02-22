const asyncHandler = require("express-async-handler");
const BadRequest = require("../errors/bad-request");
const Chat = require("../models/ChatModel");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    new BadRequest("user Id Required");
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.status(StatusCodes.OK).json({
      chat: isChat[0],
    });
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id })
        .populate("users", "-password")
        .populate("latestMessage");
      res.status(StatusCodes.OK).json({ chat: FullChat });
    } catch (error) {}
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ user: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then((result) => {
        res.status(StatusCodes.OK).json({ result });
      });
  } catch (error) {}
});

module.exports = { accessChat, fetchChats };
