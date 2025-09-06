require('dotenv').config(); // Load variables from .env
const mysql = require('mysql2');


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});



// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('MySQL Connection Error: ', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

module.exports = db;
