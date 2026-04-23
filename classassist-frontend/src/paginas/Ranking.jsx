import { useEffect, useState } from "react";
import axios from "axios";
import LayoutSistema from "../componentes/LayoutSistema";

export default function Ranking() {
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState("");
  const [ranking, setRanking] = useState([]);

  const obtenerClases = async () => {
    try {
      const respuesta = await axios.get(`${import.meta.env.VITE_API_URL}/api/clases`);
      setClases(respuesta.data);

      if (respuesta.data.length > 0 && !claseSeleccionada) {
        setClaseSeleccionada(String(respuesta.data[0].id));
      }
    } catch (error) {
      console.error("Error al obtener clases:", error);
    }
  };

  const obtenerRanking = async (claseId) => {
    if (!claseId) return;

    try {
      const respuesta = await axios.get(`${import.meta.env.VITE_API_URL}/api/ranking/${claseId}`);
      setRanking(respuesta.data);
    } catch (error) {
      console.error("Error al obtener ranking:", error);
      setRanking([]);
    }
  };

  useEffect(() => {
    obtenerClases();
  }, []);

  useEffect(() => {
    if (claseSeleccionada) {
      obtenerRanking(claseSeleccionada);
    }
  }, [claseSeleccionada]);

  return (
    <LayoutSistema>
    <div className="app-page">
      <div className="app-shell">
        <div className="app-card" style={{ padding: "28px", marginBottom: "22px" }}>
          <h1 className="app-title">Ranking de Participación</h1>
          <p className="app-subtitle">
            Consulta el rendimiento de participación por clase.
          </p>
        </div>

        <div className="app-card" style={{ padding: "24px", marginBottom: "22px" }}>
          <h2 className="app-section-title">Clase</h2>

          <select
            value={claseSeleccionada}
            onChange={(e) => setClaseSeleccionada(e.target.value)}
          >
            {clases.map((clase) => (
              <option key={clase.id} value={clase.id}>
                {clase.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="app-grid">
          {ranking.length === 0 ? (
            <div className="app-card" style={{ padding: "24px" }}>
              <p className="app-subtitle">
                No hay datos de participación para esta clase.
              </p>
            </div>
          ) : (
            ranking.map((estudiante, index) => (
              <div key={estudiante.id} className="app-card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                  <div
                    style={{
                      minWidth: "68px",
                      width: "68px",
                      height: "68px",
                      borderRadius: "999px",
                      background:
                        index === 0
                          ? "linear-gradient(135deg, #f59e0b, #fbbf24)"
                          : index === 1
                          ? "linear-gradient(135deg, #94a3b8, #cbd5e1)"
                          : index === 2
                          ? "linear-gradient(135deg, #b45309, #d97706)"
                          : "linear-gradient(135deg, #2563eb, #3b82f6)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1.4rem",
                    }}
                  >
                    #{index + 1}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>
                      {estudiante.nombre}
                    </h3>
                    <p style={{ margin: "0 0 4px 0" }}>
                      <strong>Carné:</strong> {estudiante.carne}
                    </p>
                    <p style={{ margin: "0 0 4px 0" }}>
                      <strong>Participaciones:</strong> {estudiante.total_participaciones}
                    </p>
                    <p style={{ margin: "0 0 4px 0" }}>
                      <strong>Promedio:</strong> {Number(estudiante.promedio_nota).toFixed(2)}
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>Total de puntos:</strong> {Number(estudiante.total_puntos).toFixed(2)}
                    </p>
                  </div>
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