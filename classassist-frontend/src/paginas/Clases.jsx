import { useEffect, useState } from "react";
import axios from "axios";

export default function Clases() {
  const [clases, setClases] = useState([]);
  const [nombre, setNombre] = useState("");
  const [seccion, setSeccion] = useState("");
  const [horario, setHorario] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const obtenerClases = async () => {
    try {
      const respuesta = await axios.get("http://localhost:4000/api/clases");
      setClases(respuesta.data);
    } catch (error) {
      console.error("Error al obtener clases:", error);
    }
  };

  const crearClase = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:4000/api/clases", {
        nombre,
        seccion,
        horario,
        docente_id: usuario?.id || null,
      });

      setNombre("");
      setSeccion("");
      setHorario("");
      obtenerClases();
    } catch (error) {
      console.error("Error al crear clase:", error);
      alert("No se pudo crear la clase");
    }
  };

  useEffect(() => {
    obtenerClases();
  }, []);

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.tarjeta}>
        <h1 style={estilos.titulo}>Gestión de Clases</h1>

        <form onSubmit={crearClase} style={estilos.formulario}>
          <input
            type="text"
            placeholder="Nombre de la clase"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={estilos.input}
            required
          />

          <input
            type="text"
            placeholder="Sección"
            value={seccion}
            onChange={(e) => setSeccion(e.target.value)}
            style={estilos.input}
          />

          <input
            type="text"
            placeholder="Horario"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            style={estilos.input}
          />

          <button type="submit" style={estilos.boton}>
            Crear clase
          </button>
        </form>

        <div style={estilos.lista}>
          {clases.length === 0 ? (
            <p style={estilos.textoVacio}>No hay clases registradas todavía.</p>
          ) : (
            clases.map((clase) => (
              <div key={clase.id} style={estilos.item}>
                <h3 style={estilos.nombreClase}>{clase.nombre}</h3>
                <p>Sección: {clase.seccion || "Sin sección"}</p>
                <p>Horario: {clase.horario || "Sin horario"}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const estilos = {
  contenedor: {
    minHeight: "100vh",
    background: "#eef2f7",
    padding: "30px 16px",
  },
  tarjeta: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  titulo: {
    marginBottom: "20px",
    color: "#1f2937",
  },
  formulario: {
    display: "grid",
    gap: "12px",
    marginBottom: "30px",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
  },
  boton: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },
  lista: {
    display: "grid",
    gap: "16px",
  },
  item: {
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    background: "#f9fafb",
  },
  nombreClase: {
    margin: "0 0 10px 0",
    color: "#1f2937",
  },
  textoVacio: {
    color: "#6b7280",
  },
};