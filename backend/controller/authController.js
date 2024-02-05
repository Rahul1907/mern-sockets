const asyncHandler = require("express-async-handler");
const { BadRequestError } = require("../errors");
const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const { generateToken } = require("../utility/utility");
const NotFound = require("../errors/not-found-error");

const registerUser = asyncHandler(async (req, res) => {
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
      token: generateToken(user._id),
    });
  } else {
    throw new BadRequestError("Some went wrong");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("email and password is required");
  }

  const user = await User.findOne({ email: email });
  if (user) {
    if (user.password === password) {
      res.status(StatusCodes.OK).json({
        id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      throw new BadRequestError("Wrong Password");
    }
  } else {
    throw new NotFound("Email or Password is incorrect");
  }
});

module.exports = { registerUser, loginUser };
