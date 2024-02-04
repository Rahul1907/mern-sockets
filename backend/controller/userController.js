const asyncHandler = require("express-async-errors");
const { BadRequestError } = require("../errors");
const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");

const registerUser = asyncHandler(async () => {
  let { name, email, password, confirmPassword, pic } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please Enter all required fields");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new BadRequestError("User All ready Exist");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(StatusCodes.CREATED).json({
      id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
    });
  } else {
    throw new BadRequestError("Some went wrong");
  }
});
