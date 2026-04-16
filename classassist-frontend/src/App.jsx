import { BrowserRouter, Routes, Route } from "react-router-dom";
import InicioSesion from "./paginas/InicioSesion";
import Panel from "./paginas/Panel";
import Clases from "./paginas/Clases";
import Estudiantes from "./paginas/Estudiantes";
import Asistencias from "./paginas/Asistencias";
import RegistroAsistencia from "./paginas/RegistroAsistencia";
import Ruleta from "./paginas/Ruleta";
import Grupos from "./paginas/Grupos";
import Temporizador from "./paginas/Temporizador";
import PantallaClase from "./paginas/PantallaClase";
import Ranking from "./paginas/Ranking";
import ExportacionExcel from "./paginas/ExportacionExcel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioSesion />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="/clases" element={<Clases />} />
        <Route path="/estudiantes" element={<Estudiantes />} />
        <Route path="/asistencias" element={<Asistencias />} />
        <Route path="/asistencia/:token" element={<RegistroAsistencia />} />
        <Route path="/ruleta" element={<Ruleta />} />
        <Route path="/grupos" element={<Grupos />} />
        <Route path="/temporizador" element={<Temporizador />} />
        <Route path="/pantalla-clase" element={<PantallaClase />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/exportacion-excel" element={<ExportacionExcel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;