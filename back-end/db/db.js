const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

//Connection
const pool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	waitForConnections: true,
});

module.exports = pool;
