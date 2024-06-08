const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: '',
    password: '',
    database: 'auth_db'
});
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected...');
});

module.exports = db;
