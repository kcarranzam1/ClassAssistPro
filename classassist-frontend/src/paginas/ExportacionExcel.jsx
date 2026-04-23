import { useEffect, useState } from "react";
import axios from "axios";
import LayoutSistema from "../componentes/LayoutSistema";

export default function ExportacionExcel() {
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState("");

  const obtenerClases = async () => {
    try {
      const respuesta = await axios.get(`${import.meta.env.VITE_API_URL}/api/clases`);
      const data = Array.isArray(respuesta.data) ? respuesta.data : [];

      setClases(data);

      if (data.length > 0 && !claseSeleccionada) {
        setClaseSeleccionada(String(data[0].id));
      }
    } catch (error) {
      console.error("Error al obtener clases:", error);
      setClases([]);
    }
  };

  useEffect(() => {
    obtenerClases();
  }, []);

  const descargarArchivo = (tipo) => {
    if (!claseSeleccionada) {
      alert("Selecciona una clase");
      return;
    }

    window.open(
      `${import.meta.env.VITE_API_URL}/api/exportacion/${tipo}/${claseSeleccionada}`,
      "_blank"
    );
  };

  return (
    <LayoutSistema>
      <div className="app-page">
        <div className="app-shell">
          <div className="app-card" style={{ padding: "28px", marginBottom: "22px" }}>
            <h1 className="app-title">Exportación a Excel</h1>
            <p className="app-subtitle">
              Exporta información académica en archivos Excel estructurados.
            </p>
          </div>

          <div className="app-card" style={{ padding: "24px", marginBottom: "22px" }}>
            <h2 className="app-section-title">Selecciona una clase</h2>

            <select
              value={claseSeleccionada}
              onChange={(e) => setClaseSeleccionada(e.target.value)}
            >
              {Array.isArray(clases) && clases.length > 0 ? (
                clases.map((clase) => (
                  <option key={clase.id} value={clase.id}>
                    {clase.nombre}
                  </option>
                ))
              ) : (
                <option value="">No hay clases disponibles</option>
              )}
            </select>
          </div>

          <div className="app-grid-3">
            <div className="app-card" style={{ padding: "24px" }}>
              <h2 className="app-section-title">Estudiantes</h2>
              <p className="app-subtitle" style={{ marginBottom: "18px" }}>
                Exporta el listado completo de estudiantes de la clase.
              </p>
              <button
                className="app-btn-primary"
                onClick={() => descargarArchivo("estudiantes")}
              >
                Descargar estudiantes
              </button>
            </div>

            <div className="app-card" style={{ padding: "24px" }}>
              <h2 className="app-section-title">Asistencias</h2>
              <p className="app-subtitle" style={{ marginBottom: "18px" }}>
                Exporta la asistencia de la última sesión disponible.
              </p>
              <button
                className="app-btn-success"
                onClick={() => descargarArchivo("asistencias")}
              >
                Descargar asistencias
              </button>
            </div>

            <div className="app-card" style={{ padding: "24px" }}>
              <h2 className="app-section-title">Ranking</h2>
              <p className="app-subtitle" style={{ marginBottom: "18px" }}>
                Exporta el ranking de participación y puntos.
              </p>
              <button
                className="app-btn-warning"
                onClick={() => descargarArchivo("ranking")}
              >
                Descargar ranking
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutSistema>
  );
}