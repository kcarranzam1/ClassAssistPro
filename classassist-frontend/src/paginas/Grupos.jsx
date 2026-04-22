import { useEffect, useState } from "react";
import axios from "axios";
import LayoutSistema from "../componentes/LayoutSistema";

export default function Grupos() {
  const [sesiones, setSesiones] = useState([]);
  const [sesionSeleccionada, setSesionSeleccionada] = useState("");
  const [modo, setModo] = useState("cantidad");
  const [valor, setValor] = useState("");
  const [grupos, setGrupos] = useState([]);

  const obtenerSesiones = async () => {
    try {
      const respuesta = await axios.get("${import.meta.env.VITE_API_URL}/api/grupos/sesiones");
      setSesiones(respuesta.data);
    } catch (error) {
      console.error("Error al obtener sesiones:", error);
    }
  };

  const obtenerGrupos = async (sesionId) => {
    if (!sesionId) return;

    try {
      const respuesta = await axios.get(`${import.meta.env.VITE_API_URL}/api/grupos/${sesionId}`);
      setGrupos(respuesta.data);
    } catch (error) {
      console.error("Error al obtener grupos:", error);
      setGrupos([]);
    }
  };

  const generarGrupos = async () => {
    if (!sesionSeleccionada || !valor) {
      alert("Debes seleccionar una sesión e ingresar un valor");
      return;
    }

    try {
      const respuesta = await axios.post("${import.meta.env.VITE_API_URL}/api/grupos/generar", {
        sesion_id: sesionSeleccionada,
        modo,
        valor,
      });

      setGrupos(respuesta.data.grupos);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.mensaje || "No se pudieron generar los grupos");
    }
  };

  const guardarNotaGrupo = async (grupoId, nota) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/grupos/nota/${grupoId}`, {
        nota,
      });

      if (sesionSeleccionada) {
        obtenerGrupos(sesionSeleccionada);
      }
    } catch (error) {
      console.error("Error al guardar nota:", error);
      alert("No se pudo guardar la nota del grupo");
    }
  };

  useEffect(() => {
    obtenerSesiones();
  }, []);

  useEffect(() => {
    if (sesionSeleccionada) {
      obtenerGrupos(sesionSeleccionada);
    }
  }, [sesionSeleccionada]);

  return (
    <LayoutSistema>
    <div className="app-page">
      <div className="app-shell">
        <div className="app-card" style={{ padding: "28px", marginBottom: "22px" }}>
          <h1 className="app-title">Grupos Aleatorios</h1>
          <p className="app-subtitle">
            Genera grupos automáticamente con base en los estudiantes presentes.
          </p>
        </div>

        <div className="app-card" style={{ padding: "24px", marginBottom: "22px" }}>
          <h2 className="app-section-title">Configuración</h2>

          <div className="app-grid">
            <select
              value={sesionSeleccionada}
              onChange={(e) => setSesionSeleccionada(e.target.value)}
            >
              <option value="">Selecciona una sesión</option>
              {sesiones.map((sesion) => (
                <option key={sesion.id} value={sesion.id}>
                  {sesion.nombre_clase} - {sesion.fecha}
                </option>
              ))}
            </select>

            <select value={modo} onChange={(e) => setModo(e.target.value)}>
              <option value="cantidad">Definir número de grupos</option>
              <option value="tamano">Definir tamaño por grupo</option>
            </select>

            <input
              type="number"
              placeholder={modo === "cantidad" ? "Cantidad de grupos" : "Tamaño por grupo"}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />

            <button onClick={generarGrupos} className="app-btn-primary">
              Generar grupos
            </button>
          </div>
        </div>

        <div className="app-grid">
          {grupos.length === 0 ? (
            <div className="app-card" style={{ padding: "24px" }}>
              <p className="app-subtitle">No hay grupos generados todavía.</p>
            </div>
          ) : (
            grupos.map((grupo) => (
              <div key={grupo.id} className="app-card" style={{ padding: "24px" }}>
                <h2 style={{ marginTop: 0, color: "#0f172a" }}>{grupo.nombre_grupo}</h2>

                <div className="app-grid" style={{ marginBottom: "16px" }}>
                  {grupo.integrantes.length === 0 ? (
                    <p className="app-subtitle">Sin integrantes</p>
                  ) : (
                    grupo.integrantes.map((integrante) => (
                      <div key={integrante.id} className="app-list-item">
                        <strong>{integrante.nombre}</strong>
                        <p style={{ margin: "6px 0 0 0" }}>
                          Carné: {integrante.carne}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="app-actions">
                  <input
                    type="number"
                    defaultValue={grupo.nota}
                    placeholder="Nota del grupo"
                    style={{ maxWidth: "180px" }}
                    id={`nota-${grupo.id}`}
                  />

                  <button
                    onClick={() =>
                      guardarNotaGrupo(
                        grupo.id,
                        document.getElementById(`nota-${grupo.id}`).value
                      )
                    }
                    className="app-btn-success"
                  >
                    Guardar nota
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </LayoutSistema>
  );
}