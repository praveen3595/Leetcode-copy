const redisClient = require("../config/redis");
const User = require("../models/users");
const { use } = require("../routes/userAuth");
const validate = require("../utils/util");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const register = async (req, res) => {
    try {
        // Validate request body
        validate(req.body);
        const { firstName, email, password } = req.body;
        req.body.password = bcrypt.hashSync(password, 10);
        const user = await User.create(req.body);
        const token = jwt.sign({_id: user._id, email: email, role: "user"}, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
        res.cookie("token", token, {maxAge: 60*60*1000})
        res.status(201).json({
            status: "success",
            user: {
                firstName: user.firstName,
                email: user.email,
                id: user._id,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            message: "User registered successfully",
            token
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid email or password",
            });
        }
        // Compare password
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: "fail",
                    message: "Error comparing password",
                });
            }
            if (!result) {
                return res.status(401).json({
                    status: "fail",
                    message: "Invalid email or password",
                });
            }
            // Generate token
            jwt.sign({_id: user._id, email: email, role: user.role}, process.env.JWT_SECRET, { expiresIn: 60 * 60 }, (err, token) => {
                if (err) {
                    return res.status(500).json({
                        status: "fail",
                        message: "Error generating token",
                    });
                }
                // Set token in cookie
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 3600000, // 1 hour
                });
                res.status(200).json({
                    status: "success",
                    user: {
                        firstName: user.firstName,
                        email: user.email,
                        id: user._id,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    },
                    message: "User logged in successfully",
                    token
                });
            }
            ); 
        }
        );
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
}
const logout = async (req, res) => {
    try {
        // Verify token
        // add middleware to verify token
        // clear token from cookie
        const token = req.cookies.token;
        const payload = jwt.decode(token);
        console.log("payload", payload);
        if (!payload) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid token",
            });
        }

        await redisClient.set(`token:${token}`, "blocked")
        await redisClient.expire(`token:${token}`, payload.exp); // 1 hour
        // Clear token from cookie
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 0, // 0 to delete the cookie
        });
        res.status(200).json({
            status: "success",
            message: "User logged out successfully",
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
}
const adminRegister = async (req, res) => {
    try {
        // Validate request body
        validate(req.body);
        const { firstName, email, password } = req.body;
        req.body.password = bcrypt.hashSync(password, 10);
        const user = await User.create(req.body);
        const token = jwt.sign({_id: user._id, email: email, role: user.role}, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
        res.cookie("token", token, {maxAge: 60*60*1000})
        res.status(201).json({
            status: "success",
            user: {
                firstName: user.firstName,
                email: user.email,
                id: user._id,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            message: "User registered successfully",
            token
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
}
module.exports = {
    register,
    login,
    logout,
    adminRegister
};