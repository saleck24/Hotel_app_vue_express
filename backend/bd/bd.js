const mysql = require("mysql2");

// Pool de connexions (meilleure pratique)
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "hotel_app_js",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
