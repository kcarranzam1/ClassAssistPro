import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function RegistroAsistencia() {
  const { token } = useParams();

  const [sesion, setSesion] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudianteId, setEstudianteId] = useState("");
  const [selfie, setSelfie] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);

        const respuestaSesion = await axios.get(
          `http://localhost:4000/api/asistencias/sesion/${token}`
        );

        const datosSesion = respuestaSesion.data;
        setSesion(datosSesion);

        const respuestaEstudiantes = await axios.get(
          `http://localhost:4000/api/asistencias/estudiantes-clase/${datosSesion.clase_id}`
        );

        setEstudiantes(respuestaEstudiantes.data);
      } catch (error) {
        console.error("Error al cargar datos de asistencia:", error);
        alert("No se pudo cargar la sesión o los estudiantes");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [token]);

  const registrar = async () => {
    if (!estudianteId) {
      alert("Selecciona un estudiante");
      return;
    }

    const formData = new FormData();
    formData.append("token_qr", token);
    formData.append("estudiante_id", estudianteId);

    if (selfie) {
      formData.append("selfie", selfie);
    }

    try {
      const respuesta = await axios.post(
        "http://localhost:4000/api/asistencias/registrar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(respuesta.data.mensaje);
      setEstudianteId("");
      setSelfie(null);
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
      alert(error?.response?.data?.mensaje || "No se pudo registrar asistencia");
    }
  };

  if (cargando) {
    return (
      <div style={estilos.contenedor}>
        <div style={estilos.tarjeta}>
          <h1 style={estilos.titulo}>Registro de Asistencia</h1>
          <p>Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.tarjeta}>
        <h1 style={estilos.titulo}>Registro de Asistencia</h1>

        {sesion && (
          <p style={estilos.subtitulo}>
            Clase: <strong>{sesion.nombre_clase}</strong>
          </p>
        )}

        <select
          value={estudianteId}
          onChange={(e) => setEstudianteId(e.target.value)}
          style={estilos.input}
        >
          <option value="">Selecciona tu nombre</option>
          {estudiantes.map((estudiante) => (
            <option key={estudiante.id} value={estudiante.id}>
              {estudiante.nombre} - {estudiante.carne}
            </option>
          ))}
        </select>

        <label style={estilos.label}>Tomar o subir selfie</label>
        <input
          type="file"
          accept="image/*"
          capture="user"
          onChange={(e) => setSelfie(e.target.files[0])}
          style={estilos.input}
        />

        <button onClick={registrar} style={estilos.boton}>
          Registrar asistencia
        </button>
      </div>
    </div>
  );
}

const estilos = {
  contenedor: {
    minHeight: "100vh",
    background: "#eef2f7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  tarjeta: {
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "500px",
  },
  titulo: {
    marginBottom: "16px",
    color: "#1f2937",
  },
  subtitulo: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#374151",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
    marginBottom: "16px",
  },
  boton: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#16a34a",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  },
};