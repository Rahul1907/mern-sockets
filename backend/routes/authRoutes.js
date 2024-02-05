const express = require("express");
const { registerUser, loginUser } = require("../controller/authController");

const router = express.Router();

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
module.exports = router;
