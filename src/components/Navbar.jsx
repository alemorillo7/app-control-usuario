import { Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import "../styles.css"; // Importar el archivo CSS
// import { Boton } from "./Boton";

const NavbarComponent = () => {
    return (
        <Navbar bg="light" expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
                    ADA
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/buscador" className="nav-link-custom">
                            Buscar
                        </Nav.Link>
                        <Nav.Link as={Link} to="/agregar" className="nav-link-custom">
                            Agregar Usuario
                        </Nav.Link>
                        <Nav.Link as={Link} to="/informacion" className="nav-link-custom">
                            Informacion
                        </Nav.Link>
                    </Nav>
                    {/* Mover el Boton fuera del Nav para alinearlo correctamente */}
                    {/* <Boton /> */}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;