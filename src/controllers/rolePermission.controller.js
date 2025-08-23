const {asyncHandler} = require('../utils/asyncHandler.utils.js')
const jwt = require('jsonwebtoken')
const express = require("express");
const {ApiResponse} = require('../utils/ApiResponse.utils.js')
const {ApiError} = require('../utils/ApiError.utils.js')
const app = express()
const bcrypt = require('bcrypt')

const createRolePermission = asyncHandler(async (req, res) => {
    const { role_id, permission_id } = req.body;

    if (!role_id || !permission_id) {
        throw new ApiError(404, "Role ID and Permission ID are required");
    }
    const dbPool = req.app.get("dbPool");

    const existingRolePermission = await dbPool.query(
        "SELECT * FROM role_permissions WHERE role_id = ? AND permission_id = ?",
        [role_id, permission_id]
    );

    if (existingRolePermission[0].length > 0) {
        throw new ApiError(409, "Role-Permission Association Already Exists");
    }

    try {
        const result = await dbPool.query(
            "INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)",
            [role_id, permission_id]
        );
        console.log(result)
        return res
            .status(201)
            .json(new ApiResponse(201, "Role-Permission Association Created", { id: result[0].insertId, role_id, permission_id }));
    } catch (error) {
        throw new ApiError(500, "Error creating role-permission association", error);
    }
});

const getAllRolePermissions = asyncHandler(async (req, res) => {
    const dbPool = req.app.get("dbPool");

    try {
        const rolePermissions = await dbPool.query("SELECT * FROM role_permissions");
        return res
            .status(200)
            .json(new ApiResponse(200, "Role-Permission Associations Retrieved", rolePermissions[0]));
    } catch (error) {
        throw new ApiError(500, "Error retrieving role-permission associations", error);
    }
});

const removePermissionFromRole = asyncHandler(async (req, res) => {
    const { role_id, permission_id } = req.body;

    if (!role_id || !permission_id) {
        throw new ApiError(404, "Role ID and Permission ID are required");
    }
    const dbPool = req.app.get("dbPool");

    try {
        const result = await dbPool.query(
            "DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?",
            [role_id, permission_id]
        );

        if (result[0].affectedRows === 0) {
            throw new ApiError(404, "Role-Permission Association Not Found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, "Permission Removed from Role"));
    } catch (error) {
        throw new ApiError(500, "Error removing permission from role", error);
    }
});

module.exports = {
    createRolePermission,
    getAllRolePermissions,
    removePermissionFromRole
};