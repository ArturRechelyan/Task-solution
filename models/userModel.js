const db = require('../config/db');

const User = {
    create: (userData, callback) => {
        const sql = 'INSERT INTO users SET ?';
        db.query(sql, userData, callback);
    },
    findByEmail: (email, callback) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], callback);
    },
    findByPhone: (phone, callback) => {
        const sql = 'SELECT * FROM users WHERE phone = ?';
        db.query(sql, [phone], callback);
    },
    verifyPhone: (phone, callback) => {
        const sql = 'UPDATE users SET is_verified = true WHERE phone = ?';
        db.query(sql, [phone], callback);
    }
};

module.exports = User;
