import { Link, useLocation } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useState, useEffect } from "react";
import "../estilos/styles.css";

const NavbarComponent = () => {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    const isActiveLink = (path) => {
        return location.pathname.startsWith(path);
    };

useEffect(() => {
    let lastKnownScrollPosition = 0;
    let ticking = false;
    
    const updateScrolled = (scrollPos) => {
        setIsScrolled(scrollPos > 10);
    };
    
    const handleScroll = () => {
        lastKnownScrollPosition = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrolled(lastKnownScrollPosition);
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, []);

    return (
        <Navbar 
            expand="lg" 
            className={`custom-navbar ${isScrolled ? 'scrolled' : ''}`}
            fixed="top"
        >
            <Container>
                <Navbar.Brand 
                    as={Link} 
                    to="/" 
                    className="navbar-brand-custom"
                    aria-label="Ir a la página principal"
                >
                    ADA
                </Navbar.Brand>
                
                <Navbar.Toggle 
                    aria-controls="basic-navbar-nav"
                    aria-label="Abrir menú de navegación"
                    onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.click()}
                />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link 
                            as={Link} 
                            to="/buscador" 
                            className={`nav-link-custom ${isActiveLink('/buscador') ? 'active' : ''}`}
                            aria-label="Buscar usuarios"
                        >
                            <span aria-hidden="true">🔍</span> Buscar
                        </Nav.Link>
                        
                        <Nav.Link 
                            as={Link} 
                            to="/agregar" 
                            className={`nav-link-custom ${isActiveLink('/agregar') ? 'active' : ''}`}
                            aria-label="Agregar nuevo usuario"
                        >
                            <span aria-hidden="true">👤</span> Agregar Usuario
                        </Nav.Link>
                        
                        <Nav.Link 
                            as={Link} 
                            to="/informacion" 
                            className={`nav-link-custom ${isActiveLink('/informacion') ? 'active' : ''}`}
                            aria-label="Ver información del sitio"
                        >
                            <span aria-hidden="true">ℹ️</span> Información
                        </Nav.Link>
                    </Nav>
                    
                    <Nav className="ms-auto">
                        <div className="user-button-placeholder">
                            {/* <Boton /> */}
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;