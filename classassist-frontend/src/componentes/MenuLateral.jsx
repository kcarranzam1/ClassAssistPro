import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MenuLateral() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [esMovil, setEsMovil] = useState(window.innerWidth <= 900);

  const opciones = [
    { nombre: "Panel", ruta: "/panel" },
    { nombre: "Clases", ruta: "/clases" },
    { nombre: "Estudiantes", ruta: "/estudiantes" },
    { nombre: "Asistencias", ruta: "/asistencias" },
    { nombre: "Ruleta", ruta: "/ruleta" },
    { nombre: "Grupos", ruta: "/grupos" },
    { nombre: "Temporizador", ruta: "/temporizador" },
    { nombre: "Pantalla de Clase", ruta: "/pantalla-clase" },
    { nombre: "Ranking", ruta: "/ranking" },
    { nombre: "Exportación Excel", ruta: "/exportacion-excel" },
  ];

  useEffect(() => {
    const manejarResize = () => {
      const movil = window.innerWidth <= 900;
      setEsMovil(movil);

      if (!movil) {
        setMenuAbierto(false);
      }
    };

    window.addEventListener("resize", manejarResize);
    return () => window.removeEventListener("resize", manejarResize);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <>
      {esMovil && (
        <button
          style={estilos.botonMenuMovil}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          ☰ Menú
        </button>
      )}

      {esMovil && menuAbierto && (
        <div
          style={estilos.overlay}
          onClick={() => setMenuAbierto(false)}
        />
      )}

      <aside
        style={{
          ...estilos.menu,
          ...(esMovil ? estilos.menuMovil : {}),
          ...(esMovil && menuAbierto ? estilos.menuMovilAbierto : {}),
        }}
      >
        <div style={estilos.logoBox}>
          <h2 style={estilos.logo}>ClassAssist Pro</h2>
          <p style={estilos.sublogo}>Menú principal</p>
        </div>

        <nav style={estilos.nav}>
          {opciones.map((opcion) => {
            const activo = location.pathname === opcion.ruta;

            return (
              <Link
                key={opcion.ruta}
                to={opcion.ruta}
                onClick={() => setMenuAbierto(false)}
                style={{
                  ...estilos.link,
                  ...(activo ? estilos.linkActivo : {}),
                }}
              >
                {opcion.nombre}
              </Link>
            );
          })}
        </nav>

        <button style={estilos.botonCerrarSesion} onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </aside>
    </>
  );
}

const estilos = {
  botonMenuMovil: {
    position: "fixed",
    top: "14px",
    left: "14px",
    zIndex: 1200,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "10px 14px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    zIndex: 1090,
  },
  menu: {
    width: "270px",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0f172a 0%, #1e3a8a 100%)",
    color: "#fff",
    padding: "24px 18px",
    position: "sticky",
    top: 0,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 1100,
  },
  menuMovil: {
    position: "fixed",
    left: 0,
    top: 0,
    transform: "translateX(-100%)",
    transition: "transform 0.25s ease",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  menuMovilAbierto: {
    transform: "translateX(0)",
  },
  logoBox: {
    marginBottom: "28px",
  },
  logo: {
    margin: 0,
    fontSize: "1.6rem",
  },
  sublogo: {
    marginTop: "8px",
    color: "rgba(255,255,255,0.75)",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
  },
  link: {
    padding: "12px 14px",
    borderRadius: "12px",
    color: "#fff",
    background: "rgba(255,255,255,0.06)",
    textDecoration: "none",
    fontWeight: 600,
  },
  linkActivo: {
    background: "#2563eb",
  },
  botonCerrarSesion: {
    marginTop: "20px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 14px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};