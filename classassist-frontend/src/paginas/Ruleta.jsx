import { useEffect, useState } from "react";
import axios from "axios";
import LayoutSistema from "../componentes/LayoutSistema";

export default function Ruleta() {
  const [sesiones, setSesiones] = useState([]);
  const [sesionSeleccionada, setSesionSeleccionada] = useState("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [animando, setAnimando] = useState(false);
  const [nota, setNota] = useState("");
  const [comentario, setComentario] = useState("");
  const [participaciones, setParticipaciones] = useState([]);

  const obtenerSesiones = async () => {
    try {
      const respuesta = await axios.get("http://localhost:4000/api/grupos/sesiones");
      setSesiones(respuesta.data);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerParticipaciones = async (sesionId) => {
    if (!sesionId) return;

    try {
      const respuesta = await axios.get(
        `http://localhost:4000/api/ruleta/participaciones/${sesionId}`
      );
      setParticipaciones(respuesta.data);
    } catch (error) {
      console.error(error);
    }
  };

  const girarRuleta = async () => {
    if (!sesionSeleccionada) {
      alert("Selecciona una sesión");
      return;
    }

    setAnimando(true);
    setEstudianteSeleccionado(null);

    setTimeout(async () => {
      try {
        const respuesta = await axios.get(
          `http://localhost:4000/api/ruleta/aleatorio/${sesionSeleccionada}`
        );
        setEstudianteSeleccionado(respuesta.data);
      } catch (error) {
        console.error(error);
        alert(error?.response?.data?.mensaje || "No se pudo seleccionar estudiante");
      } finally {
        setAnimando(false);
      }
    }, 1800);
  };

  const guardarParticipacion = async () => {
    if (!estudianteSeleccionado) {
      alert("Primero selecciona un estudiante");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/ruleta/guardar", {
        sesion_id: sesionSeleccionada,
        estudiante_id: estudianteSeleccionado.id,
        nota,
        comentario,
      });

      alert("Participación guardada correctamente");
      setNota("");
      setComentario("");
      obtenerParticipaciones(sesionSeleccionada);
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar la participación");
    }
  };

  useEffect(() => {
    obtenerSesiones();
  }, []);

  useEffect(() => {
    if (sesionSeleccionada) {
      obtenerParticipaciones(sesionSeleccionada);
    }
  }, [sesionSeleccionada]);

  return (
    <LayoutSistema>
    <div className="app-page">
      <div className="app-shell">
        <div className="app-card" style={{ padding: "28px", marginBottom: "22px" }}>
          <h1 className="app-title">Ruleta de Participación</h1>
          <p className="app-subtitle">
            Selecciona aleatoriamente estudiantes presentes y registra su participación.
          </p>
        </div>

        <div className="app-grid-2">
          <div className="app-card" style={{ padding: "24px" }}>
            <h2 className="app-section-title">Configuración</h2>

            <div className="app-grid">
              <select
                value={sesionSeleccionada}
                onChange={(e) => setSesionSeleccionada(e.target.value)}
              >
                <option value="">Selecciona una clase/sesión</option>
                {sesiones.map((sesion) => (
                  <option key={sesion.id} value={sesion.id}>
                    {sesion.nombre_clase} - {sesion.fecha}
                  </option>
                ))}
              </select>

              <button onClick={girarRuleta} className="app-btn-primary">
                Girar ruleta
              </button>
            </div>
          </div>

          <div className="app-card" style={{ padding: "24px" }}>
            <h2 className="app-section-title">Resultado</h2>

            <div
              style={{
                minHeight: "180px",
                border: "2px dashed #cbd5e1",
                borderRadius: "18px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "20px",
                background: "#f8fbff",
              }}
            >
              {animando ? (
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#7c3aed" }}>
                  🎡 Girando...
                </div>
              ) : estudianteSeleccionado ? (
                <div>
                  <h2 style={{ margin: "0 0 10px 0", color: "#0f172a" }}>
                    {estudianteSeleccionado.nombre}
                  </h2>
                  <p style={{ margin: 0 }}>
                    <strong>Carné:</strong> {estudianteSeleccionado.carne}
                  </p>
                </div>
              ) : (
                <p className="app-subtitle">No se ha seleccionado estudiante.</p>
              )}
            </div>
          </div>
        </div>

        {estudianteSeleccionado && (
          <div className="app-card" style={{ padding: "24px", marginTop: "22px" }}>
            <h2 className="app-section-title">Registrar participación</h2>

            <div className="app-grid">
              <input
                type="number"
                placeholder="Nota de participación"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
              />

              <textarea
                placeholder="Comentario"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                style={{
                  minHeight: "100px",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  border: "1px solid #dbe3ef",
                  resize: "vertical",
                }}
              />

              <button onClick={guardarParticipacion} className="app-btn-success">
                Guardar participación
              </button>
            </div>
          </div>
        )}

        <div className="app-card" style={{ padding: "24px", marginTop: "22px" }}>
          <h2 className="app-section-title">Participaciones registradas</h2>

          <div className="app-grid">
            {participaciones.length === 0 ? (
              <p className="app-subtitle">No hay participaciones registradas.</p>
            ) : (
              participaciones.map((item) => (
                <div key={item.id} className="app-list-item">
                  <h3 style={{ marginTop: 0, marginBottom: "10px", color: "#0f172a" }}>
                    {item.nombre}
                  </h3>
                  <p style={{ margin: "0 0 6px 0" }}>
                    <strong>Carné:</strong> {item.carne}
                  </p>
                  <p style={{ margin: "0 0 6px 0" }}>
                    <strong>Nota:</strong> {item.nota}
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Comentario:</strong> {item.comentario || "Sin comentario"}
                  </p>
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