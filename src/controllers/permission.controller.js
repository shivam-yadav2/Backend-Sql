const {asyncHandler} = require('../utils/asyncHandler.utils.js')
const jwt = require('jsonwebtoken')
const express = require("express");
const {ApiResponse} = require('../utils/ApiResponse.utils.js')
const {ApiError} = require('../utils/ApiError.utils.js')
const app = express()
const bcrypt = require('bcrypt')

const createPermission = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new ApiError(404, "Permission name is required");
    }
    const dbPool = req.app.get("dbPool");

    const existingPermission = await dbPool.query(
        "SELECT * FROM permissions WHERE name = ?",
        [name]
    );

    if (existingPermission[0].length > 0) {
        throw new ApiError(409, "Permission Already Exists");
    }

    try {
        const result = await dbPool.query(
            "INSERT INTO permissions (name) VALUES (?)",
            [name]
        );
        console.log(result)
        return res
            .status(201)
            .json(new ApiResponse(201, "Permission Created", { id: result[0].insertId, name }));
    } catch (error) {
        throw new ApiError(500, "Error creating permission", error);
    }
});

const getAllPermissions = asyncHandler(async (req, res) => {
    const dbPool = req.app.get("dbPool");

    try {
        const permissions = await dbPool.query("SELECT * FROM permissions");
        return res
            .status(200)
            .json(new ApiResponse(200, "Permissions Retrieved", permissions[0]));
    } catch (error) {
        throw new ApiError(500, "Error retrieving permissions", error);
    }
});

const getPermissionById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const dbPool = req.app.get("dbPool");

    try {
        const permission = await dbPool.query("SELECT * FROM permissions WHERE id = ?", [id]);
        if (permission[0].length === 0) {
            throw new ApiError(404, "Permission Not Found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, "Permission Retrieved", permission[0][0]));
    } catch (error) {
        throw new ApiError(500, "Error retrieving permission", error);
    }
});

const deletePermission = asyncHandler(async (req ,res )=>{
    const {id} = req.params
    if(!id){
        throw new ApiError(404 , "Permission id is required");
    }
    const dbPool = req.app.get("dbPool");
    const permission = await dbPool.query(
        "SELECT * FROM permissions WHERE id = ?",
        [id]
    )
    if(permission[0].length === 0){
        throw new ApiError(404, "Permission Not Found");
    }
    try {
        await dbPool.query(
            "DELETE FROM permissions WHERE id = ?",
            [id]
        )
        return res
        .status(200)
        .json(new ApiResponse(200, "Permission Deleted Successfully"));
    } catch (error) {
        throw new ApiError(500, "Error deleting permission", error);
    }
})

module.exports = {
    createPermission,
    getAllPermissions,
    getPermissionById,
    deletePermission
}
