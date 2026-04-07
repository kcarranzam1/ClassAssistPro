import { Link } from "react-router-dom";

export default function Panel() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.tarjeta}>
        <h1 style={estilos.titulo}>Bienvenido a ClassAssist Pro</h1>

        <p style={estilos.texto}>
          Catedrático: <strong>{usuario?.nombre || "Sin nombre"}</strong>
        </p>

        <p style={estilos.texto}>
          Correo: <strong>{usuario?.correo || "Sin correo"}</strong>
        </p>

        <Link to="/clases" style={estilos.boton}>
          Ir a Gestión de Clases
        </Link>
      </div>
    </div>
  );
}

const estilos = {
  contenedor: {
    minHeight: "100vh",
    background: "#eef2f7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  tarjeta: {
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "600px",
  },
  titulo: {
    marginBottom: "20px",
    color: "#1f2937",
  },
  texto: {
    fontSize: "18px",
    marginBottom: "10px",
    color: "#374151",
  },
  boton: {
    display: "inline-block",
    marginTop: "20px",
    padding: "12px 18px",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};