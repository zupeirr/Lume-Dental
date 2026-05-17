// ============================================================
//  PRODUCTION MySQL db.js
//  Drop-in replacement for config/db.js (SQLite version).
//
//  HOW TO SWITCH:
//    1. Run your schema:  mysql -u root -p lume_dental < sql/init.sql
//    2. Rename this file:  config/db.mysql.js  →  config/db.js
//       (back up the SQLite version first if you need it)
//    3. Set these env vars in your production .env:
//         DB_HOST=your-mysql-host
//         DB_USER=your-db-user
//         DB_PASSWORD=your-db-password
//         DB_NAME=lume_dental
//    4. Restart the server — no other code changes needed.
// ============================================================

require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'lume_dental',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

// Test the connection on startup
pool.getConnection()
  .then(conn => {
    console.log('MySQL Database connected successfully!');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL connection failed:', err.message);
    process.exit(1);
  });

// Matches the exact same API shape as the SQLite wrapper:
//   const [rows] = await db.query(sql, params)
module.exports = {
  query: (sql, params = []) => pool.execute(sql, params),
};
