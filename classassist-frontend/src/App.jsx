import { BrowserRouter, Routes, Route } from "react-router-dom";
import InicioSesion from "./paginas/InicioSesion";
import Panel from "./paginas/Panel";
import Clases from "./paginas/Clases";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioSesion />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="/clases" element={<Clases />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;