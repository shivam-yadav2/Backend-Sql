const express = require("express");
const {
  createRole,
  getAllRoles,
  getRoleById,
  deleteRole,
} = require("../controllers/role.controller.js");
const { verifyJwt } = require("../middleware/auth.middelware.js");

const router = express.Router();

router.route("/create-role").post(verifyJwt, createRole);
router.route("/get-all-roles").get(getAllRoles);
router.route("/get-roleById/:id").get(getRoleById);
router.route("/delete-role/:id").get(verifyJwt, deleteRole);

module.exports = router;
