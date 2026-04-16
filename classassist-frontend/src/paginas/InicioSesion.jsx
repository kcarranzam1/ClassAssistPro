import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function InicioSesion() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await axios.post(
        "http://localhost:4000/api/autenticacion/iniciar-sesion",
        {
          correo,
          contrasena,
        }
      );

      localStorage.setItem("usuario", JSON.stringify(respuesta.data.usuario));
      navigate("/panel");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("No se pudo iniciar sesión");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        className="app-card"
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "34px",
          background: "rgba(255,255,255,0.98)",
        }}
      >
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: "2.2rem", color: "#0f172a" }}>
            ClassAssist Pro
          </h1>
          <p style={{ marginTop: "10px", color: "#64748b" }}>
            Inicio de sesión del catedrático
          </p>
        </div>

        <form onSubmit={manejarEnvio} className="app-grid">
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <button type="submit" className="app-btn-primary" style={{ width: "100%" }}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}