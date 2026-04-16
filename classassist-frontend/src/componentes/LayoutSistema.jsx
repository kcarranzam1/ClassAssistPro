import MenuLateral from "./MenuLateral";

export default function LayoutSistema({ children }) {
  return (
    <div style={estilos.contenedor}>
      <MenuLateral />
      <main style={estilos.main}>{children}</main>
    </div>
  );
}

const estilos = {
  contenedor: {
    display: "flex",
    minHeight: "100vh",
    background: "#f3f6fb",
  },
  main: {
    flex: 1,
  },
};