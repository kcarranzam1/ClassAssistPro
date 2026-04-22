import { useEffect, useState } from "react";
import axios from "axios";
import LayoutSistema from "../componentes/LayoutSistema";

export default function Clases() {
  const [clases, setClases] = useState([]);
  const [nombre, setNombre] = useState("");
  const [seccion, setSeccion] = useState("");
  const [horario, setHorario] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const obtenerClases = async () => {
    try {
      const respuesta = await axios.get(`${import.meta.env.VITE_API_URL}/api/clases`);
      setClases(respuesta.data);
    } catch (error) {
      console.error("Error al obtener clases:", error);
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setSeccion("");
    setHorario("");
    setEditandoId(null);
  };

  const guardarClase = async (e) => {
    e.preventDefault();

    try {
      if (editandoId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/clases/${editandoId}`, {
          nombre,
          seccion,
          horario,
        });
      } else {
        await axios.post("${import.meta.env.VITE_API_URL}/api/clases", {
          nombre,
          seccion,
          horario,
          docente_id: usuario?.id || null,
        });
      }

      limpiarFormulario();
      obtenerClases();
    } catch (error) {
      console.error("Error al guardar clase:", error);
      alert("No se pudo guardar la clase");
    }
  };

  const editarClase = (clase) => {
    setNombre(clase.nombre);
    setSeccion(clase.seccion || "");
    setHorario(clase.horario || "");
    setEditandoId(clase.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarClase = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta clase?");
    if (!confirmar) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/clases/${id}`);
      obtenerClases();

      if (editandoId === id) {
        limpiarFormulario();
      }
    } catch (error) {
      console.error("Error al eliminar clase:", error);
      alert("No se pudo eliminar la clase");
    }
  };

  useEffect(() => {
    obtenerClases();
  }, []);

  return (
    <LayoutSistema>
    <div className="app-page">
      <div className="app-shell">
        <div className="app-card" style={{ padding: "28px", marginBottom: "22px" }}>
          <h1 className="app-title">Gestión de Clases</h1>
          <p className="app-subtitle">
            Administra tus clases, secciones y horarios desde un solo lugar.
          </p>
        </div>

        <div className="app-grid-2">
          <div className="app-card" style={{ padding: "24px" }}>
            <h2 className="app-section-title">
              {editandoId ? "Editar clase" : "Nueva clase"}
            </h2>

            <form onSubmit={guardarClase} className="app-grid">
              <input
                type="text"
                placeholder="Nombre de la clase"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Sección"
                value={seccion}
                onChange={(e) => setSeccion(e.target.value)}
              />

              <input
                type="text"
                placeholder="Horario"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
              />

              <div className="app-actions">
                <button type="submit" className="app-btn-primary">
                  {editandoId ? "Actualizar clase" : "Crear clase"}
                </button>

                {editandoId && (
                  <button
                    type="button"
                    className="app-btn-muted"
                    onClick={limpiarFormulario}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="app-card" style={{ padding: "24px" }}>
            <h2 className="app-section-title">Resumen</h2>

            <div className="app-grid">
              <div className="app-stat">
                <h3>Total de clases</h3>
                <p>{clases.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="app-card" style={{ padding: "24px", marginTop: "22px" }}>
          <h2 className="app-section-title">Listado de clases</h2>

          <div className="app-grid">
            {clases.length === 0 ? (
              <p className="app-subtitle">No hay clases registradas todavía.</p>
            ) : (
              clases.map((clase) => (
                <div key={clase.id} className="app-list-item">
                  <h3 style={{ marginTop: 0, marginBottom: "10px", color: "#0f172a" }}>
                    {clase.nombre}
                  </h3>
                  <p style={{ margin: "0 0 6px 0" }}>
                    <strong>Sección:</strong> {clase.seccion || "Sin sección"}
                  </p>
                  <p style={{ margin: "0 0 14px 0" }}>
                    <strong>Horario:</strong> {clase.horario || "Sin horario"}
                  </p>

                  <div className="app-actions">
                    <button
                      className="app-btn-warning"
                      onClick={() => editarClase(clase)}
                    >
                      Editar
                    </button>

                    <button
                      className="app-btn-danger"
                      onClick={() => eliminarClase(clase.id)}
                    >
                      Eliminar
                    </button>
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