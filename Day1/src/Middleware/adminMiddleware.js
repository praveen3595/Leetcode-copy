const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const User = require('../models/users');

const adminMiddleware = async (req, res, next) => {
    // Check if user is authenticated
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error('No token provided');
        }
        let payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload) {
            throw new Error('Invalid token no payload');
        }
        const userId = payload._id;
        if (!userId) {
            throw new Error('Invalid token no userId');
        }
        
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (payload.role != 'admin') {
            throw new Error('User is not an admin');
        }
        // check if user is blocked in the redis database
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) { 
            throw new Error('User is blocked');
        }
        req.result = user;
        next();
    } catch (error) {
        res.send({
            status: "fail",
            message: error.message,
        });
    }
} 

module.exports = adminMiddleware;