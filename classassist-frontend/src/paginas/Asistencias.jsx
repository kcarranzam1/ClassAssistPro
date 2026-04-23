import { useEffect, useState } from "react";
import axios from "axios";
import LayoutSistema from "../componentes/LayoutSistema";

export default function Asistencias() {
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState("");
  const [qr, setQr] = useState("");
  const [enlace, setEnlace] = useState("");
  const [sesionId, setSesionId] = useState(null);
  const [asistencias, setAsistencias] = useState([]);

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

  const crearSesion = async () => {
    if (!claseSeleccionada) {
      alert("Selecciona una clase");
      return;
    }

    try {
      const respuesta = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/asistencias/sesion`,
        {
          clase_id: claseSeleccionada,
        }
      );

      setQr(respuesta.data.qr || "");
      setEnlace(respuesta.data.enlace || "");
      setSesionId(respuesta.data.sesion_id || null);

      if (respuesta.data.sesion_id) {
        obtenerAsistencias(respuesta.data.sesion_id);
      }
    } catch (error) {
      console.error("Error al crear sesión:", error);
      alert("No se pudo crear la sesión QR");
    }
  };

  const obtenerAsistencias = async (idSesion) => {
    if (!idSesion) return;

    try {
      const respuesta = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/asistencias/lista/${idSesion}`
      );
      setAsistencias(Array.isArray(respuesta.data) ? respuesta.data : []);
    } catch (error) {
      console.error("Error al obtener asistencias:", error);
      setAsistencias([]);
    }
  };

  useEffect(() => {
    obtenerClases();
  }, []);

  useEffect(() => {
    let intervalo;

    if (sesionId) {
      intervalo = setInterval(() => {
        obtenerAsistencias(sesionId);
      }, 3000);
    }

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [sesionId]);

  return (
    <LayoutSistema>
      <div className="app-page">
        <div className="app-shell">
          <div className="app-card" style={{ padding: "28px", marginBottom: "22px" }}>
            <h1 className="app-title">Asistencia con QR</h1>
            <p className="app-subtitle">
              Genera sesiones de asistencia y registra a los estudiantes en tiempo real.
            </p>
          </div>

          <div className="app-grid-2">
            <div className="app-card" style={{ padding: "24px" }}>
              <h2 className="app-section-title">Configuración de sesión</h2>

              <div className="app-grid">
                <select
                  value={claseSeleccionada}
                  onChange={(e) => setClaseSeleccionada(e.target.value)}
                >
                  {Array.isArray(clases) &&
                    clases.map((clase) => (
                      <option key={clase.id} value={clase.id}>
                        {clase.nombre}
                      </option>
                    ))}
                </select>

                <button onClick={crearSesion} className="app-btn-primary">
                  Generar QR de asistencia
                </button>
              </div>
            </div>

            <div className="app-card" style={{ padding: "24px" }}>
              <h2 className="app-section-title">Resumen</h2>

              <div className="app-stat">
                <h3>Asistencias registradas</h3>
                <p>{asistencias.length}</p>
              </div>
            </div>
          </div>

          {qr && (
            <div
              className="app-card"
              style={{ padding: "24px", marginTop: "22px", textAlign: "center" }}
            >
              <h2 className="app-section-title">Código QR generado</h2>
              <img
                src={qr}
                alt="QR de asistencia"
                style={{
                  width: "100%",
                  maxWidth: "260px",
                  margin: "0 auto 16px auto",
                  display: "block",
                }}
              />
              <p className="app-subtitle" style={{ wordBreak: "break-all" }}>
                {enlace}
              </p>
            </div>
          )}

          <div className="app-card" style={{ padding: "24px", marginTop: "22px" }}>
            <h2 className="app-section-title">Asistencias registradas</h2>

            <div className="app-grid">
              {asistencias.length === 0 ? (
                <p className="app-subtitle">No hay asistencias todavía.</p>
              ) : (
                asistencias.map((item) => (
                  <div
                    key={item.id}
                    className="app-list-item"
                    style={{
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {item.selfie_url ? (
                      <a
                        href={item.selfie_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: "inline-block" }}
                      >
                        <img
                          src={item.selfie_url}
                          alt={`Selfie de ${item.nombre}`}
                          style={{
                            width: "72px",
                            height: "72px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            border: "1px solid #dbe3ef",
                            cursor: "pointer",
                          }}
                        />
                      </a>
                    ) : (
                      <div
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "12px",
                          border: "1px dashed #cbd5e1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#64748b",
                          fontSize: "12px",
                          textAlign: "center",
                          padding: "6px",
                        }}
                      >
                        Sin selfie
                      </div>
                    )}

                    <div style={{ flex: 1 }}>
                      <h3 style={{ marginTop: 0, marginBottom: "8px", color: "#0f172a" }}>
                        {item.nombre}
                      </h3>
                      <p style={{ margin: "0 0 6px 0" }}>
                        <strong>Carné:</strong> {item.carne}
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong>Registro:</strong> {item.fecha_registro}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutSistema>
  );
}