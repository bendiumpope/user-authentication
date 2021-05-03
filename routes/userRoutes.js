const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

router
    .post('/register', authController.register);
router
    .post('/login', authController.login);
    

router
    .route('/allusers')
    .get(authController.protect, userController.getAllUsers)


module.exports = router;    