const mysql = require('mysql2/promise');
require('dotenv').config();

// Determine if SSL is needed (TiDB Cloud requires SSL)
const useSSL = process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true';

// Database configuration (works with local MySQL and TiDB Cloud)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '2240',
  database: process.env.DB_NAME || 'skywings_airlines',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  multipleStatements: false,
  dateStrings: false,
  // Enable SSL for TiDB Cloud / production deployments
  ...(useSSL && {
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  })
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection (silent - errors will be caught when pool is actually used)
// This prevents duplicate connection messages in server.js

// Helper function to execute queries
async function query(sql, params = []) {
  try {
    const [results, fields] = await pool.execute(sql, params);
    // For INSERT queries, results is a ResultSetHeader with insertId
    // For SELECT queries, results is an array of rows
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to get a single row
async function queryOne(sql, params = []) {
  const results = await query(sql, params);
  return results[0] || null;
}

module.exports = {
  pool,
  query,
  queryOne
};

