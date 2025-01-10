import { useState } from "react";
import { Button, Form, Card, Alert } from "react-bootstrap";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Formulario = () => {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [dni, setDni] = useState("");
    const [direccion, setDireccion] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [observacion, setObservacion] = useState("")

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
                            // required
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
                            placeholder="Ingrese observacion"
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
                </Form>
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                {mensaje && <Alert variant="success" className="mt-3">{mensaje}</Alert>}
            </Card.Body>
        </Card>
    );
};

export default Formulario;