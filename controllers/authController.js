const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');

const accountSid = '';
const authToken = '';
const jwtSecret = 'JWT_SECRET';

const client = new twilio(accountSid, authToken);

const sendVerificationCode = (phone, code) => {
    return client.messages.create({
        body: `Your verification code is ${code}`,
        to: phone,
        from: '+14237193357'
    });
};

exports.register = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, password } = req.body;

    User.findByEmail(email, (err, result) => {
        if (result.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        } else {
            const hashedPassword = bcrypt.hashSync(password, 8);
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            const newUser = { name, email, phone, password: hashedPassword, verification_code: verificationCode };
            User.create(newUser, (err, result) => {
                if (err) throw err;

                sendVerificationCode(phone, verificationCode)
                    .then(message => res.json({ msg: 'User registered. Please check your phone for verification code.' }))
                    .catch(err => res.status(500).json({ msg: 'Failed to send verification code', error: err.message }));
            });
        }
    });
};

exports.verifyPhone = (req, res) => {
    const { phone, code } = req.body;

    User.findByPhone(phone, (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const user = result[0];

        if (user.verification_code !== code) {
            return res.status(400).json({ msg: 'Invalid verification code' });
        }

        User.verifyPhone(phone, (err, result) => {
            if (err) throw err;
            res.json({ msg: 'Phone number verified successfully' });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            return res.status(400).json({ msg: 'User not found' });
        }
        
        const user = result[0];

        if (!user.is_verified) {
            return res.status(400).json({ msg: 'Please verify your phone number first' });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    });
};
