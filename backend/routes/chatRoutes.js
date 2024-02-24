const express = require("express");
const { auth } = require("../middleware/auth");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addUserGroupChat,
  removeUserGroupChat,
} = require("../controller/chatController");

const router = express.Router();

router.route("/").get(auth, fetchChats).post(auth, accessChat);
router.route("/group").post(auth, createGroupChat);
router.route("/group-rename").put(auth, renameGroupChat);
router.route("/group-remove").put(auth, removeUserGroupChat);
router.route("/group-add").put(auth, addUserGroupChat);

module.exports = router;
