const express = require("express");
const { verifyJwt } = require("../middleware/auth.middelware.js");
const { createRolePermission, removePermissionFromRole } = require("../controllers/rolePermission.controller.js");

const router = express.Router();

router.route("/assign-permission").post(verifyJwt, createRolePermission);
router.route("/remove-permission").post(verifyJwt, removePermissionFromRole);

module.exports = router;
