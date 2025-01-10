import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/Navbar";
import Home from "./pages/Home";
import { AgregarUsuario } from "./pages/AgregarUsuario";
import { Buscar } from "./pages/Buscar";

const App = () => {
    return (
        <Router basename="/app-control-usuario"> {/* Agrega el basename aquí */}
            <NavbarComponent />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/buscador" element={<Buscar />} />
                <Route path="/agregar" element={<AgregarUsuario />} />
                <Route path="/*" element={<Home />} />
            </Routes>
        </Router>
    );
};

export default App;