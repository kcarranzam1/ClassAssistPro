import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LayoutSistema from "../componentes/LayoutSistema";

export default function PantallaClase() {
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [ultimaSesion, setUltimaSesion] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [participaciones, setParticipaciones] = useState([]);
  const [grupos, setGrupos] = useState([]);

  const obtenerClases = async () => {
    try {
      const respuesta = await axios.get("http://localhost:4000/api/clases");
      setClases(respuesta.data);

      if (respuesta.data.length > 0 && !claseSeleccionada) {
        setClaseSeleccionada(String(respuesta.data[0].id));
      }
    } catch (error) {
      console.error("Error al obtener clases:", error);
    }
  };

  const obtenerEstudiantes = async (claseId) => {
    try {
      const respuesta = await axios.get(
        `http://localhost:4000/api/estudiantes?clase_id=${claseId}`
      );
      setEstudiantes(respuesta.data);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      setEstudiantes([]);
    }
  };

  const obtenerUltimaSesion = async (claseId) => {
    try {
      const respuesta = await axios.get(
        `http://localhost:4000/api/asistencias/ultima-sesion/${claseId}`
      );

      setUltimaSesion(respuesta.data);

      if (respuesta.data?.id) {
        obtenerAsistencias(respuesta.data.id);
        obtenerParticipaciones(respuesta.data.id);
        obtenerGrupos(respuesta.data.id);
      } else {
        setAsistencias([]);
        setParticipaciones([]);
        setGrupos([]);
      }
    } catch (error) {
      console.error("Error al obtener última sesión:", error);
      setUltimaSesion(null);
      setAsistencias([]);
      setParticipaciones([]);
      setGrupos([]);
    }
  };

  const obtenerAsistencias = async (sesionId) => {
    try {
      const respuesta = await axios.get(
        `http://localhost:4000/api/asistencias/lista/${sesionId}`
      );
      setAsistencias(respuesta.data);
    } catch (error) {
      console.error("Error al obtener asistencias:", error);
      setAsistencias([]);
    }
  };

  const obtenerParticipaciones = async (sesionId) => {
    try {
      const respuesta = await axios.get(
        `http://localhost:4000/api/ruleta/participaciones/${sesionId}`
      );
      setParticipaciones(respuesta.data);
    } catch (error) {
      console.error("Error al obtener participaciones:", error);
      setParticipaciones([]);
    }
  };

  const obtenerGrupos = async (sesionId) => {
    try {
      const respuesta = await axios.get(
        `http://localhost:4000/api/grupos/${sesionId}`
      );
      setGrupos(respuesta.data);
    } catch (error) {
      console.error("Error al obtener grupos:", error);
      setGrupos([]);
    }
  };

  useEffect(() => {
    obtenerClases();
  }, []);

  useEffect(() => {
    if (claseSeleccionada) {
      obtenerEstudiantes(claseSeleccionada);
      obtenerUltimaSesion(claseSeleccionada);
    }
  }, [claseSeleccionada]);

  const nombreClase =
    clases.find((clase) => String(clase.id) === String(claseSeleccionada))
      ?.nombre || "Sin clase";

  return (
    <LayoutSistema>
    <div className="app-page">
      <div className="app-shell">
        <div className="app-card" style={{ padding: "28px", marginBottom: "22px" }}>
          <h1 className="app-title">Pantalla de Clase</h1>
          <p className="app-subtitle">
            Vista general del estado actual de la clase y sus actividades.
          </p>
        </div>

        <div className="app-card" style={{ padding: "24px", marginBottom: "22px" }}>
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

          <div style={{ marginTop: "18px" }}>
            <h2 style={{ margin: 0, color: "#0f172a" }}>{nombreClase}</h2>
            <p className="app-subtitle" style={{ marginTop: "6px" }}>
              Última sesión: {ultimaSesion ? ultimaSesion.fecha : "Sin sesiones"}
            </p>
          </div>
        </div>

        <div className="app-grid-4" style={{ marginBottom: "22px" }}>
          <div className="app-stat">
            <h3>Total de estudiantes</h3>
            <p>{estudiantes.length}</p>
          </div>

          <div className="app-stat">
            <h3>Asistencias</h3>
            <p>{asistencias.length}</p>
          </div>

          <div className="app-stat">
            <h3>Participaciones</h3>
            <p>{participaciones.length}</p>
          </div>

          <div className="app-stat">
            <h3>Grupos</h3>
            <p>{grupos.length}</p>
          </div>
        </div>

        <div className="app-card" style={{ padding: "24px", marginBottom: "22px" }}>
          <h2 className="app-section-title">Accesos rápidos</h2>

          <div className="app-actions">
            <Link to="/asistencias" className="app-nav-link">Asistencia QR</Link>
            <Link to="/ruleta" className="app-nav-link">Ruleta</Link>
            <Link to="/grupos" className="app-nav-link">Grupos</Link>
            <Link to="/temporizador" className="app-nav-link">Temporizador</Link>
            <Link to="/ranking" className="app-nav-link">Ranking</Link>
          </div>
        </div>

        <div className="app-grid-3">
          <div className="app-card" style={{ padding: "24px" }}>
            <h2 className="app-section-title">Últimas asistencias</h2>
            <div className="app-grid">
              {asistencias.length === 0 ? (
                <p className="app-subtitle">No hay asistencias registradas.</p>
              ) : (
                asistencias.slice(0, 5).map((item) => (
                  <div key={item.id} className="app-list-item">
                    <strong>{item.nombre}</strong>
                    <p style={{ margin: "6px 0 0 0" }}>Carné: {item.carne}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="app-card" style={{ padding: "24px" }}>
            <h2 className="app-section-title">Últimas participaciones</h2>
            <div className="app-grid">
              {participaciones.length === 0 ? (
                <p className="app-subtitle">No hay participaciones registradas.</p>
              ) : (
                participaciones.slice(0, 5).map((item) => (
                  <div key={item.id} className="app-list-item">
                    <strong>{item.nombre}</strong>
                    <p style={{ margin: "6px 0 0 0" }}>Nota: {item.nota}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="app-card" style={{ padding: "24px" }}>
            <h2 className="app-section-title">Grupos actuales</h2>
            <div className="app-grid">
              {grupos.length === 0 ? (
                <p className="app-subtitle">No hay grupos generados.</p>
              ) : (
                grupos.map((grupo) => (
                  <div key={grupo.id} className="app-list-item">
                    <strong>{grupo.nombre_grupo}</strong>
                    <p style={{ margin: "6px 0 0 0" }}>Nota: {grupo.nota}</p>
                    <p style={{ margin: "6px 0 0 0" }}>
                      Integrantes: {grupo.integrantes.length}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </LayoutSistema>
  );
}