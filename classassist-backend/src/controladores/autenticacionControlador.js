const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../configuracion/baseDatos");

const iniciarSesion = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios",
      });
    }

    const [filas] = await pool.query(
      "SELECT * FROM catedraticos WHERE correo = ?",
      [correo]
    );

    if (filas.length === 0) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos",
      });
    }

    const catedratico = filas[0];

    const contrasenaValida = await bcrypt.compare(
      contrasena,
      catedratico.contrasena
    );

    if (!contrasenaValida) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos",
      });
    }

    const token = jwt.sign(
      {
        id: catedratico.id,
        nombre: catedratico.nombre,
        correo: catedratico.correo,
      },
      process.env.JWT_CLAVE,
      { expiresIn: "8h" }
    );

    res.json({
      mensaje: "Inicio de sesión exitoso",
      token,
      catedratico: {
        id: catedratico.id,
        nombre: catedratico.nombre,
        correo: catedratico.correo,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({
      mensaje: "Error interno del servidor",
    });
  }
};

module.exports = {
  iniciarSesion,
};