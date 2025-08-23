const express = require("express");
const {
  createPermission,
  getAllPermissions,
  getPermissionById,
  deletePermission,
} = require("../controllers/permission.controller.js");
const { verifyJwt } = require("../middleware/auth.middelware.js");

const router = express.Router();

router.route("/create-permission").post(verifyJwt, createPermission);
router.route("/get-all-permissions").get(getAllPermissions);
router.route("/get-permissionById/:id").get(getPermissionById);
router.route("/delete-permission/:id").get(verifyJwt, deletePermission);

module.exports = router;