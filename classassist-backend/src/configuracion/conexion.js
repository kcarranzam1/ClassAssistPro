const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: "localhost",
  user: "classassist",
  password: "Clase1234!",
  database: "classassist"
});

conexion.connect((error) => {
  if (error) {
    console.error("Error de conexión:", error);
  } else {
    console.log("Conectado a MySQL");
  }
});

module.exports = conexion;