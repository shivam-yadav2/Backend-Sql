const {asyncHandler} = require('../utils/asyncHandler.utils.js')
const jwt = require('jsonwebtoken')
const express = require("express");
const {ApiResponse} = require('../utils/ApiResponse.utils.js')
const {ApiError} = require('../utils/ApiError.utils.js')
const app = express()
const bcrypt = require('bcrypt')

const register = asyncHandler(async (req , res)=>{
    // console.log("Body",req)
    const {name , email,password , role_id} = req.body;

    if(!name || !email ||!password || !role_id){
        throw new ApiError(404 , "All Fields are required");
    }
    const dbPool = req.app.get("dbPool");

    const createdUser = await dbPool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    )
    console.log(createdUser)
    if(createdUser[0].length > 0){
        throw new ApiError(409, "Admin Already Exists");
    }

    try {
        const hashPassword = await bcrypt.hash(password, 10)
        const check = await dbPool.query(
            "INSERT INTO users (name , email , password , role_id) VALUES (?,?,?,?)",
            [name , email , hashPassword , role_id]
        )
        console.log(check)
        return res
    .status(201)
    .json(new ApiResponse(201, "Admin Created", createdUser));
    } catch (error) {
        throw new ApiError(409, "Admin Already Exists" , error);
    }
})

const generateToken = (user) => {
    console.log(user)
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role_id
        },
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    )
}

const login = asyncHandler(async (req , res)=>{
    const {email , password} = req.body;

    if(!email || !password){
        throw new ApiError(404 , "All Fields are required");
    }
    const dbPool = req.app.get("dbPool");

    const user = await dbPool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    )

    // console.log(user)

    if(user.length === 0){
        throw new ApiError(404, "Admin Not Found");
    }

    const isPasswordValid = await bcrypt.compare(password, user[0][0].password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid Credentials");
    }

    const token = generateToken(user[0][0]);

    return res
    .status(200)
    .json(new ApiResponse(200, "Login Successful", {user: user[0], token}));
})

const getallUsers = asyncHandler(async (req , res)=>{
    const dbPool = req.app.get("dbPool");

    const users = await dbPool.query(
        "SELECT u.id, u.name, u.email, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id",
    )

    console.log(users)

    return res
    .status(200)
    .json(new ApiResponse(200, "Users Retrieved", users));
})

module.exports = {
    register,
    login,
    getallUsers
}
