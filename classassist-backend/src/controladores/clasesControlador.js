const conexion = require("../configuracion/conexion");

const obtenerClases = (req, res) => {
  const consulta = "SELECT * FROM clases";

  conexion.query(consulta, (error, resultados) => {
    if (error) {
      return res.status(500).json({ mensaje: "Error al obtener clases" });
    }

    res.json(resultados);
  });
};

const crearClase = (req, res) => {
  const { nombre, seccion, horario, docente_id } = req.body;

  const consulta =
    "INSERT INTO clases (nombre, seccion, horario, docente_id) VALUES (?, ?, ?, ?)";

  conexion.query(
    consulta,
    [nombre, seccion, horario, docente_id],
    (error, resultado) => {
      if (error) {
        return res.status(500).json({ mensaje: "Error al crear clase" });
      }

      res.json({
        mensaje: "Clase creada correctamente",
        id: resultado.insertId,
      });
    }
  );
};

module.exports = {
  obtenerClases,
  crearClase,
};