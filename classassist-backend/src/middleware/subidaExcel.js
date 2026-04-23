const multer = require("multer");
const path = require("path");
const fs = require("fs");

const carpetaUploads = path.join(__dirname, "../../uploads");

if (!fs.existsSync(carpetaUploads)) {
  fs.mkdirSync(carpetaUploads, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpetaUploads);
  },
  filename: (req, file, cb) => {
    const nombreUnico = Date.now() + path.extname(file.originalname);
    cb(null, nombreUnico);
  },
});

const filtroArchivo = (req, file, cb) => {
  const extensionesPermitidas = [".xlsx", ".xls"];
  const extension = path.extname(file.originalname).toLowerCase();

  if (extensionesPermitidas.includes(extension)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos Excel (.xlsx, .xls)"));
  }
};

const upload = multer({
  storage,
  fileFilter: filtroArchivo,
});

module.exports = upload;