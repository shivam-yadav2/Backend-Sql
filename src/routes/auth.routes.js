const express = require("express");
const { register, getallUsers, login } = require("../controllers/auth.controller.js");

const router = express.Router();

router.route("/register-user").post(register);
router.route("/login-user").post(login);
router.route("/all-users").get(getallUsers);

module.exports = router;
