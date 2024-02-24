const asyncHandler = require("express-async-handler");
const BadRequest = require("../errors/bad-request");
const Chat = require("../models/ChatModel");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");
const NotFound = require("../errors/not-found-error");

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
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then((result) => {
        res.status(StatusCodes.OK).json({ result });
      });
  } catch (error) {}
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { users, chatName } = req.body;
  if (!users) {
    return new BadRequest("Pleas Fill all fields");
  }

  let usersList = users;

  if (usersList.length < 2) {
    return new BadRequest("More than 2 users required");
  }

  usersList.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: chatName,
      users: usersList,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat.id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(StatusCodes.OK).json(fullGroupChat);
  } catch (error) {}

  try {
  } catch (error) {}
});

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatName, chatId } = req.body;

  if (!chatName || !chatId) {
    return new BadRequest("Please Fill Required Fields");
  }

  let updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.json(new NotFound("Group Not Found"));
  } else {
    res.json(updatedChat);
  }
});

const addUserGroupChat = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;

  if (!userId || !chatId) {
    return new BadRequest("Please Fill Required Fields");
  }

  let updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.json(new NotFound("Group Not Found"));
  } else {
    res.json(updatedChat);
  }
});

const removeUserGroupChat = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;

  if (!userId || !chatId) {
    return new BadRequest("Please Fill Required Fields");
  }

  let updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.json(new NotFound("Group Not Found"));
  } else {
    res.json(updatedChat);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addUserGroupChat,
  removeUserGroupChat,
};
