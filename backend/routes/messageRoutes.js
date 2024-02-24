const express = require("express");
const { auth } = require("../middleware/auth");
const {
  sendMessage,
  getAllMessages,
} = require("../controller/messageController");

const router = express.Router();

router.route("/").post(auth, sendMessage);
router.route("/:chatId").get(auth, getAllMessages);

module.exports = router;
