const express = require('express');
const router = express.Router();
const { register, login, logout, adminRegister} = require('../controllers/userAuth');
const userMiddleware = require('../Middleware/userMiddleware');
const adminMiddleware = require('../Middleware/adminMiddleware');

router.post('/register', register)
router.post('/login', login)
router.post('/logout', userMiddleware, logout)
router.post('/admin/register',adminMiddleware, adminRegister)
//router.get('/profile', getProfile)

module.exports = router;