import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/Navbar";
import Home from "./pages/Home";
import {AgregarUsuario} from "./pages/AgregarUsuario";

const App = () => {
    return (
        <Router>
            <NavbarComponent />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/agregar" element={<AgregarUsuario />} />
            </Routes>
        </Router>
    );
};

export default App;