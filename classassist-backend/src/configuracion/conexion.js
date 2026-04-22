const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

conexion.connect((error) => {
  if (error) {
    console.error("Error de conexión:", error);
  } else {
    console.log("Conectado a MySQL");
  }
});

module.exports = conexion;