const asyncHandler = require("express-async-handler");
const BadRequest = require("../errors/bad-request");
const Message = require("../models/MessageModel");
const User = require("../models/userModel");
const Chat = require("../models/ChatModel");
const { StatusCodes } = require("http-status-codes");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return new BadRequest("Please Pass Required Fields");
  }

  let newMessage = {
    sender: req.user.id,
    content: content,
    chat: chatId,
  };
  console.log(newMessage);
  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    res.status(StatusCodes.OK).json(message);
  } catch (error) {
    new BadRequest("Something Went Wrong");
  }
});

const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.status(StatusCodes.OK).json(messages);
  } catch (error) {
    new BadRequest("Something Went Wrong");
  }
});

module.exports = { sendMessage, getAllMessages };
