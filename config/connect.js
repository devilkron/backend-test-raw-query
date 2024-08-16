const mysql = require('mysql2');

// สร้าง connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Cp0953199795',
  database: 'register',
  connectionLimit: 10 // กำหนดจำนวน connection สูงสุดใน pool
});

// สร้าง promise-based query
const promisePool = pool.promise();

module.exports = { promisePool };
