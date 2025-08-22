const {asyncHandler} = require('../utils/asyncHandler.utils.js')
const jwt = require('jsonwebtoken')
const express = require("express");
const {ApiResponse} = require('../utils/ApiResponse.utils.js')
const {ApiError} = require('../utils/ApiError.utils.js')
const app = express()
const bcrypt = require('bcrypt')

const register = asyncHandler(async (req , res)=>{
    console.log("Body",req)
    const {name , email,password , role_id} = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10)
        const dbPool = req.app.get("dbPool");
        const check = await dbPool.query(
            "INSERT INTO users (name , email , password , role_id) VALUES (?,?,?,?)",
            [name , email , hashPassword , role_id]
        )
        console.log(check)
        return res
    .status(201)
    .json(new ApiResponse(201, "Admin Created", createdUser));
    } catch (error) {
        throw new ApiError(409, error,"Admin Already Exists");
    }
})

module.exports = {
    register
}