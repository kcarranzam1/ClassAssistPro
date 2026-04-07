const express = require("express");
const router = express.Router();

const {
  obtenerClases,
  crearClase,
} = require("../controladores/clasesControlador");

router.get("/", obtenerClases);
router.post("/", crearClase);

module.exports = router;