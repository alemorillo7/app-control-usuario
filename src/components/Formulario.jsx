/* eslint-disable react/jsx-no-undef */
import { useState } from "react";
import { Button, Form, Card, Alert, Modal } from "react-bootstrap";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const Formulario = () => {
    const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [direccion, setDireccion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [observacion, setObservacion] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(true); // Modal de login visible por defecto
  const [username, setUsername] = useState(""); // Estado para el nombre de usuario
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para verificar si está autenticado

  // Credenciales predefinidas (puedes cambiarlas o traerlas desde Firebase)
  const adminCredentials = {
    username: "admin",
    password: "Ada2025",
  };

   // Función para validar las credenciales
   const handleLogin = () => {
    if (username === adminCredentials.username && password === adminCredentials.password) {
      setIsAuthenticated(true); // Autenticación exitosa
      setShowLoginModal(false); // Cierra el modal de login
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  };

    const validarCampos = () => {
        if (!nombre.trim() || !apellido.trim() || !dni.trim()) {
            setError("Los campos nombre, apellido y DNI son obligatorios.");
            return false;
        }
        return true;
    };

    const validarDNI = async () => {
        const q = query(collection(db, "personas"), where("dni", "==", dni));
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty; // Retorna true si el DNI no existe
    };

    const agregarUsuario = async () => {
        setError("");
        setMensaje("");

        if (!validarCampos()) {
            return;
        }

        try {
            const dniDisponible = await validarDNI();
            if (!dniDisponible) {
                setError("El DNI ya está registrado.");
                return;
            }

            await addDoc(collection(db, "personas"), {
                nombre,
                apellido,
                dni,
                direccion,
                bolsones: 1,
                fechaUltimaEntrega: new Date().toLocaleDateString(),
                observacion,
            });

            setMensaje("Usuario agregado correctamente.");
            setNombre("");
            setApellido("");
            setDni("");
            setDireccion("");
            setObservacion("");
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Error al agregar usuario.");
        }
    };

    if (!isAuthenticated) {
        return (
          <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Acceso de Administrador</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingrese usuario"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese contraseña"
                  />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleLogin}>
                Ingresar
              </Button>
            </Modal.Footer>
          </Modal>
        );
      }
    
      return (
        <Card className="mt-4 shadow" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Card.Body>
            <Card.Title className="text-center mb-4" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Formulario de Registro
            </Card.Title>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre*</Form.Label>
                <Form.Control
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingrese nombre"
                  required
                  style={{ borderRadius: "10px" }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Apellido*</Form.Label>
                <Form.Control
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Ingrese apellido"
                  required
                  style={{ borderRadius: "10px" }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>DNI</Form.Label>
                <Form.Control
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  placeholder="Ingrese DNI"
                  style={{ borderRadius: "10px" }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ingrese dirección"
                  style={{ borderRadius: "10px" }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Observación</Form.Label>
                <Form.Control
                  type="text"
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  placeholder="Ingrese observación"
                  style={{ borderRadius: "10px" }}
                />
              </Form.Group>
              <Button
                onClick={agregarUsuario}
                className="mt-3 w-100"
                style={{ borderRadius: "10px", backgroundColor: "#007bff", border: "none" }}
              >
                Agregar Usuario
              </Button>
              <p className="required-fields-message">
                <span className="required-icon">*</span> son campos requeridos
              </p>
              {/* Botón de Cerrar Sesión */}
            {/* <Button
              variant="danger"
              onClick={() => setIsAuthenticated(false)}
              className="mb-3"
              style={{ borderRadius: "10px" }}
            >
              Cerrar Sesión
            </Button> */}
            </Form>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            {mensaje && <Alert variant="success" className="mt-3">{mensaje}</Alert>}
          </Card.Body>
        </Card>
      );
    };
    

export default Formulario;