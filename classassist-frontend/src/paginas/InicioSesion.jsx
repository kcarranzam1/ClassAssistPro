import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./InicioSesion.css";

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
    <div className="inicio-sesion-contenedor">
      <div className="inicio-sesion-tarjeta">
        <h1 className="inicio-sesion-titulo">ClassAssist Pro</h1>
        <p className="inicio-sesion-subtitulo">
          Inicio de sesión del catedrático
        </p>

        <form onSubmit={manejarEnvio} className="inicio-sesion-formulario">
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="inicio-sesion-input"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="inicio-sesion-input"
            required
          />

          <button type="submit" className="inicio-sesion-boton">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}