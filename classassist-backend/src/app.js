const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const autenticacionRutas = require("./rutas/autenticacionRutas");
const clasesRutas = require("./rutas/clasesRutas");

app.use("/api/autenticacion", autenticacionRutas);
app.use("/api/clases", clasesRutas);

app.get("/", (req, res) => {
  res.json({ mensaje: "API de ClassAssist Pro funcionando" });
});

module.exports = app;