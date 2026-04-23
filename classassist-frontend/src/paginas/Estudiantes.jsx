import { useEffect, useState } from "react";
import axios from "axios";
import LayoutSistema from "../componentes/LayoutSistema";

export default function Estudiantes() {
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);

  const [numeroLista, setNumeroLista] = useState("");
  const [carne, setCarne] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [archivoExcel, setArchivoExcel] = useState(null);

  const [editandoId, setEditandoId] = useState(null);

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

  const obtenerEstudiantes = async (claseId) => {
    if (!claseId) return;

    try {
      const respuesta = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/estudiantes?clase_id=${claseId}`
      );
      setEstudiantes(Array.isArray(respuesta.data) ? respuesta.data : []);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      setEstudiantes([]);
    }
  };

  const limpiarFormulario = () => {
    setNumeroLista("");
    setCarne("");
    setNombre("");
    setCorreo("");
    setEditandoId(null);
  };

  const guardarEstudiante = async (e) => {
    e.preventDefault();

    if (!claseSeleccionada) {
      alert("Debes seleccionar una clase");
      return;
    }

    try {
      if (editandoId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/estudiantes/${editandoId}`, {
          numero_lista: numeroLista,
          carne,
          nombre,
          correo,
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/estudiantes`, {
          numero_lista: numeroLista,
          carne,
          nombre,
          correo,
          clase_id: claseSeleccionada,
        });
      }

      limpiarFormulario();
      obtenerEstudiantes(claseSeleccionada);
    } catch (error) {
      console.error("Error al guardar estudiante:", error);
      alert("No se pudo guardar el estudiante");
    }
  };

  const importarExcel = async () => {
    if (!archivoExcel) {
      alert("Debes seleccionar un archivo Excel");
      return;
    }

    if (!claseSeleccionada) {
      alert("Debes seleccionar una clase");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivoExcel);
    formData.append("clase_id", claseSeleccionada);

    try {
      const respuesta = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/estudiantes/importar-excel`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(respuesta.data.mensaje);
      setArchivoExcel(null);
      obtenerEstudiantes(claseSeleccionada);
    } catch (error) {
      console.error("Error al importar Excel:", error);
      alert("No se pudo importar el archivo Excel");
    }
  };

  const editarEstudiante = (estudiante) => {
    setNumeroLista(estudiante.numero_lista || "");
    setCarne(estudiante.carne || "");
    setNombre(estudiante.nombre || "");
    setCorreo(estudiante.correo || "");
    setEditandoId(estudiante.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarEstudiante = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este estudiante?");
    if (!confirmar) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/estudiantes/${id}`);
      obtenerEstudiantes(claseSeleccionada);

      if (editandoId === id) {
        limpiarFormulario();
      }
    } catch (error) {
      console.error("Error al eliminar estudiante:", error);
      alert("No se pudo eliminar el estudiante");
    }
  };

  useEffect(() => {
    obtenerClases();
  }, []);

  useEffect(() => {
    if (claseSeleccionada) {
      obtenerEstudiantes(claseSeleccionada);
    }
  }, [claseSeleccionada]);

  return (
    <LayoutSistema>
      <div className="app-page">
        <div className="app-shell">
          <div className="app-card" style={{ padding: "28px", marginBottom: "22px" }}>
            <h1 className="app-title">Gestión de Estudiantes</h1>
            <p className="app-subtitle">
              Administra estudiantes manualmente o mediante importación desde Excel.
            </p>
          </div>

          <div className="app-grid-2">
            <div className="app-card" style={{ padding: "24px" }}>
              <h2 className="app-section-title">Clase seleccionada</h2>

              <select
                value={claseSeleccionada}
                onChange={(e) => {
                  setClaseSeleccionada(e.target.value);
                  limpiarFormulario();
                }}
              >
                {Array.isArray(clases) &&
                  clases.map((clase) => (
                    <option key={clase.id} value={clase.id}>
                      {clase.nombre}
                    </option>
                  ))}
              </select>

              <div style={{ marginTop: "18px" }} className="app-stat">
                <h3>Total de estudiantes</h3>
                <p>{estudiantes.length}</p>
              </div>
            </div>

            <div className="app-card" style={{ padding: "24px" }}>
              <h2 className="app-section-title">Carga masiva desde Excel</h2>
              <div className="app-grid">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setArchivoExcel(e.target.files[0])}
                />
                <button className="app-btn-success" onClick={importarExcel}>
                  Importar Excel
                </button>
              </div>
            </div>
          </div>

          <div className="app-card" style={{ padding: "24px", marginTop: "22px" }}>
            <h2 className="app-section-title">
              {editandoId ? "Editar estudiante" : "Nuevo estudiante"}
            </h2>

            <form onSubmit={guardarEstudiante} className="app-grid">
              <div className="app-grid-2">
                <input
                  type="text"
                  placeholder="Número de lista"
                  value={numeroLista}
                  onChange={(e) => setNumeroLista(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Carné"
                  value={carne}
                  onChange={(e) => setCarne(e.target.value)}
                  required
                />
              </div>

              <div className="app-grid-2">
                <input
                  type="text"
                  placeholder="Nombre del estudiante"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />

                <input
                  type="email"
                  placeholder="Correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>

              <div className="app-actions">
                <button type="submit" className="app-btn-primary">
                  {editandoId ? "Actualizar estudiante" : "Agregar estudiante"}
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

          <div className="app-card" style={{ padding: "24px", marginTop: "22px" }}>
            <h2 className="app-section-title">Listado de estudiantes</h2>

            <div className="app-table-wrap">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Carné</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(estudiantes) && estudiantes.length > 0 ? (
                    estudiantes.map((estudiante) => (
                      <tr key={estudiante.id}>
                        <td>{estudiante.numero_lista}</td>
                        <td>{estudiante.carne}</td>
                        <td>{estudiante.nombre}</td>
                        <td>{estudiante.correo}</td>
                        <td>
                          <div className="app-actions">
                            <button
                              className="app-btn-warning"
                              onClick={() => editarEstudiante(estudiante)}
                            >
                              Editar
                            </button>
                            <button
                              className="app-btn-danger"
                              onClick={() => eliminarEstudiante(estudiante.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No hay estudiantes registrados
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