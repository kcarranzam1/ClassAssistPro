const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.getConnection((error, connection) => {
  if (error) {
    console.error("Error al conectar con MySQL:", error);
  } else {
    console.log("Conectado a MySQL");
    connection.release();
  }
});

module.exports = pool;