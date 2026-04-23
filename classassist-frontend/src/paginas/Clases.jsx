import { useEffect, useState } from "react";
import axios from "axios";
import LayoutSistema from "../componentes/LayoutSistema";

export default function Clases() {
  const [clases, setClases] = useState([]);
  const [nombre, setNombre] = useState("");
  const [seccion, setSeccion] = useState("");
  const [horario, setHorario] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  const obtenerClases = async () => {
    try {
      const respuesta = await axios.get(`${import.meta.env.VITE_API_URL}/api/clases`);
      setClases(Array.isArray(respuesta.data) ? respuesta.data : []);
    } catch (error) {
      console.error("Error al obtener clases:", error);
      setClases([]);
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

    if (!usuario || !usuario.id) {
      alert("No se encontró el usuario de sesión");
      return;
    }

    try {
      if (editandoId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/clases/${editandoId}`, {
          nombre,
          seccion,
          horario,
          docente_id: usuario.id,
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/clases`, {
          nombre,
          seccion,
          horario,
          docente_id: usuario.id,
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
    setNombre(clase.nombre || "");
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
                  required
                />

                <input
                  type="text"
                  placeholder="Horario"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  required
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

              <div className="app-stat">
                <h3>Total de clases</h3>
                <p>{clases.length}</p>
              </div>
            </div>
          </div>

          <div className="app-card" style={{ padding: "24px", marginTop: "22px" }}>
            <h2 className="app-section-title">Listado de clases</h2>

            <div className="app-table-wrap">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Sección</th>
                    <th>Horario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(clases) && clases.length > 0 ? (
                    clases.map((clase) => (
                      <tr key={clase.id}>
                        <td>{clase.nombre}</td>
                        <td>{clase.seccion}</td>
                        <td>{clase.horario}</td>
                        <td>
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
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        No hay clases registradas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </LayoutSistema>
  );
}