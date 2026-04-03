const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API de ClassAssist Pro funcionando" });
});

app.use("/api/autenticacion", require("./rutas/autenticacionRutas"));

module.exports = app;