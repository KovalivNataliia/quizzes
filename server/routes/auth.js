const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { isUserExist } = require('../middlewares/authValidator');
const { checkPassword } = require('../middlewares/checkPassword');

router.post('/register', isUserExist, registerUser);

router.post('/login', isUserExist, checkPassword, loginUser);

module.exports = router;
