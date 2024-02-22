const asyncHandler = require("express-async-handler");
const { BadRequestError } = require("../errors");
const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const NotFound = require("../errors/not-found-error");

const allUsers = asyncHandler(async (req, res) => {
  let keywords = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keywords).find({ _id: { $ne: req.user._id } });
  res.status(StatusCodes.CREATED).json({
    users: users,
  });
});

module.exports = { allUsers };
