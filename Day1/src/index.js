const express = require('express');
const app = express();
require("dotenv").config();
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const userAuthRoutes = require('./routes/userAuth');
const redisClient = require('./config/redis');


// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/user', userAuthRoutes);
// Connect to MongoDB

const initializeConnection = async () => {
  try {
    await Promise.all([
      connectDB(),
      redisClient.connect()
    ]);
    console.log('db connected');
    app.listen(process.env.PORT, () => {
      console.log('Server is running on port number:' +  process.env.PORT);
    });
  } catch (error) {
    console.error('connection error:', error);
    process.exit(1);
  }
}
initializeConnection();

