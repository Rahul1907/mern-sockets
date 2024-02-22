const express = require("express");
const { allUsers } = require("../controller/userController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.route("/user").get(auth, allUsers);
module.exports = router;
