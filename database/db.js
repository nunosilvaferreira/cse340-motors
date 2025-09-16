const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Log successful connection
pool.on('connect', () => {
  console.log('Database connection established');
});

// Handle connection errors
pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

module.exports = pool;