const {asyncHandler} = require('../utils/asyncHandler.utils.js')
const jwt = require('jsonwebtoken')
const express = require("express");
const {ApiResponse} = require('../utils/ApiResponse.utils.js')
const {ApiError} = require('../utils/ApiError.utils.js')
const app = express()
const bcrypt = require('bcrypt')

const createRole = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new ApiError(404, "Role name is required");
    }
    const dbPool = req.app.get("dbPool");

    const existingRole = await dbPool.query(
        "SELECT * FROM roles WHERE name = ?",
        [name]
    );

    if (existingRole[0].length > 0) {
        throw new ApiError(409, "Role Already Exists");
    }

    try {
        const result = await dbPool.query(
            "INSERT INTO roles (name) VALUES (?)",
            [name]
        );
        console.log(result)
        return res
            .status(201)
            .json(new ApiResponse(201, "Role Created", { id: result[0].insertId, name }));
    } catch (error) {
        throw new ApiError(500, "Error creating role", error);
    }
});

const getAllRoles = asyncHandler(async (req, res) => {
    const dbPool = req.app.get("dbPool");

    try {
        const roles = await dbPool.query("SELECT * FROM roles");
        return res
            .status(200)
            .json(new ApiResponse(200, "Roles Retrieved", roles[0]));
    } catch (error) {
        throw new ApiError(500, "Error retrieving roles", error);
    }
});

const getRoleById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const dbPool = req.app.get("dbPool");

    try {
        const role = await dbPool.query("SELECT * FROM roles WHERE id = ?", [id]);
        if (role[0].length === 0) {
            throw new ApiError(404, "Role Not Found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, "Role Retrieved", role[0][0]));
    } catch (error) {
        throw new ApiError(500, "Error retrieving role", error);
    }
});

const deleteRole = asyncHandler(async (req ,res )=>{
    const {id} = req.params
    if(!id){
        throw new ApiError(404 , "Role id is required");
    }
    const dbPool = req.app.get("dbPool");
    const role = await dbPool.query(
        "SELECT * FROM roles WHERE id = ?",
        [id]
    )
    if(role[0].length === 0){
        throw new ApiError(404, "Role Not Found");
    }
    try {
        await dbPool.query(
            "DELETE FROM roles WHERE id = ?",
            [id]
        )
        return res
        .status(200)
        .json(new ApiResponse(200, "Role Deleted Successfully"));
    } catch (error) {
        throw new ApiError(500, "Error deleting role", error);
    }
})

module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    deleteRole
}