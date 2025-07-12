import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the pizzariya database');
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error('Failed to connect to the pizzariya database:', err.message);
  }
})();

export default pool;