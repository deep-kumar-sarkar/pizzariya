const mysql = require("mysql2/promise"); // Use promise-based MySQL

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "deep@125", // 🔒 Ideally use environment variable in production
  database: "pizzariya_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool; // Export the pool
