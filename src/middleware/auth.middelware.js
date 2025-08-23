const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/ApiError.utils.js");
const { asyncHandler } = require("../utils/asyncHandler.utils.js");
const express = require("express");
const app = express()

const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "").trim();
        console.log(token)

        if (!token) {
            throw new ApiError(401, "Unauthorized Request");
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken)

        const db = req.app.get("dbPool");

        // Query user from MySQL
        const [rows] = await db.query(
            "SELECT id, name, email, role_id FROM users WHERE id = ?",
            [decodedToken?.id]  // Make sure you used "id" while signing token
        );

        console.log(rows)
        if (!rows || rows.length === 0) {
            throw new ApiError(401, "Invalid accessToken");
        }

        req.user = rows[0]; // Attach user info to request object   
        next();

    } catch (error) {
        console.log(error)
        throw new ApiError(401, "Unauthorized Request", error);
    }
});

module.exports = { verifyJwt };