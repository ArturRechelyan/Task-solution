const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Please include a valid phone number').isMobilePhone(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], authController.register);

router.post('/verify-phone', [
    check('phone', 'Please include a valid phone number').isMobilePhone(),
    check('code', 'Verification code is required').isLength({ min: 6, max: 6 })
], authController.verifyPhone);

router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], authController.login);

module.exports = router;
