import { Link } from "react-router-dom";
import LayoutSistema from "../componentes/LayoutSistema";

export default function Panel() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const accesos = [
    { titulo: "Gestión de Clases", ruta: "/clases", descripcion: "Crea, edita y organiza tus clases." },
    { titulo: "Gestión de Estudiantes", ruta: "/estudiantes", descripcion: "Administra estudiantes y carga desde Excel." },
    { titulo: "Asistencia con QR", ruta: "/asistencias", descripcion: "Genera sesiones y registra asistencia." },
    { titulo: "Ruleta de Participación", ruta: "/ruleta", descripcion: "Selecciona estudiantes presentes aleatoriamente." },
    { titulo: "Grupos Aleatorios", ruta: "/grupos", descripcion: "Forma grupos de trabajo con los presentes." },
    { titulo: "Temporizador", ruta: "/temporizador", descripcion: "Controla el tiempo de tus actividades." },
    { titulo: "Pantalla de Clase", ruta: "/pantalla-clase", descripcion: "Visualiza el resumen general de la clase." },
    { titulo: "Ranking de Participación", ruta: "/ranking", descripcion: "Consulta el rendimiento y participación." },
  ];

  return (
    <LayoutSistema>
      <div className="app-page">
        <div className="app-shell">
          <div
            className="app-card"
            style={{
              padding: "28px",
              marginBottom: "22px",
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e3a8a 65%, #2563eb 100%)",
              color: "#fff",
            }}
          >
            <h1 style={{ margin: 0, fontSize: "2.2rem" }}>ClassAssist Pro</h1>
            <p style={{ marginTop: "8px", marginBottom: 0, color: "rgba(255,255,255,0.85)" }}>
              Panel principal del catedrático
            </p>
          </div>

          <div className="app-grid-3" style={{ marginBottom: "22px" }}>
            <div className="app-stat">
              <h3>Catedrático</h3>
              <p style={{ fontSize: "1.3rem" }}>{usuario?.nombre || "Sin nombre"}</p>
            </div>

            <div className="app-stat">
              <h3>Correo</h3>
              <p style={{ fontSize: "1.05rem", wordBreak: "break-word" }}>
                {usuario?.correo || "Sin correo"}
              </p>
            </div>

            <div className="app-stat">
              <h3>Estado</h3>
              <p style={{ fontSize: "1.3rem", color: "#16a34a" }}>Activo</p>
            </div>
          </div>

          <div className="app-card" style={{ padding: "28px" }}>
            <div style={{ marginBottom: "22px" }}>
              <h2 className="app-title" style={{ fontSize: "1.8rem", marginBottom: "6px" }}>
                Módulos del sistema
              </h2>
              <p className="app-subtitle">
                Accede rápidamente a cada funcionalidad principal del proyecto.
              </p>
            </div>

            <div className="app-grid-2">
              {accesos.map((item) => (
                <div key={item.ruta} className="app-list-item">
                  <h3 style={{ marginTop: 0, marginBottom: "8px", color: "#0f172a" }}>
                    {item.titulo}
                  </h3>
                  <p style={{ marginTop: 0, marginBottom: "16px", color: "#64748b" }}>
                    {item.descripcion}
                  </p>

                  <Link to={item.ruta} className="app-nav-link">
                    Abrir módulo
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LayoutSistema>
  );
}