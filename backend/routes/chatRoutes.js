const express = require("express");
const { auth } = require("../middleware/auth");
const { accessChat, fetchChats } = require("../controller/chatController");

const router = express.Router();

router.route("/").get(auth, fetchChats).post(auth, accessChat);
router.route("/group").post(auth);
router.route("/rename").put(auth);
router.route("/group-remove").put(auth);
router.route("/group-add").put(auth);

module.exports = router;
