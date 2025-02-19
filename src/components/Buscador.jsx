/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"; // Importa useEffect
import { Button, Form, Card, Alert } from "react-bootstrap";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";

const Buscador = () => {
    const [tipoBusqueda, setTipoBusqueda] = useState("dni");
    const [dni, setDni] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [persona, setPersona] = useState(null);
    const [error, setError] = useState("");
    const [showConfirmacion, setShowConfirmacion] = useState(false);

    // Referencia para el input de DNI
    const dniInputRef = useRef(null);

    // Referencia para el contenedor de la información del usuario
    const userInfoRef = useRef(null);

    // Referencia para el Alert de confirmación
    const confirmacionRef = useRef(null);

    // Efecto para desplazar hacia el Alert de confirmación cuando se muestra
    useEffect(() => {
        if (showConfirmacion && confirmacionRef.current) {
            confirmacionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [showConfirmacion]); // Se ejecuta cuando showConfirmacion cambia

    const buscarPersona = async () => {
        try {
            let q;
            if (tipoBusqueda === "dni") {
                q = query(collection(db, "personas"), where("dni", "==", dni));
            } else {
                const nombreCompletoBusqueda = `${apellido} ${nombre}`.toLowerCase().trim();
                q = query(collection(db, "personas"));

                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    setError("No se encontró ninguna persona con los datos proporcionados.");
                    setPersona(null);
                } else {
                    let personaEncontrada = null;
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const nombreCompletoFirestore = data.nombre.toLowerCase().trim();

                        if (nombreCompletoFirestore === nombreCompletoBusqueda) {
                            const bolsones = typeof data.bolsones === "number" ? data.bolsones : 1;
                            personaEncontrada = { id: doc.id, ...data, bolsones };
                        }
                    });

                    if (personaEncontrada) {
                        setPersona(personaEncontrada);
                        setError("");
                    } else {
                        setError("No se encontró ninguna persona con los datos proporcionados.");
                        setPersona(null);
                    }
                }
                return;
            }

            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                setError("No se encontró ninguna persona con los datos proporcionados.");
                setPersona(null);
            } else {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const bolsones = typeof data.bolsones === "number" ? data.bolsones : 1;
                    setPersona({ id: doc.id, ...data, bolsones });
                });
                setError("");
            }

            // Desplazar la pantalla hacia la sección de la persona encontrada
            setTimeout(() => {
                if (userInfoRef.current) {
                    userInfoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100); // Pequeño retraso para asegurar que el contenido esté renderizado
        } catch (error) {
            setError("Error al buscar persona.");
        }
    };

    const handleConfirmarEntrega = async () => {
        try {
            const personaRef = doc(db, "personas", persona.id);
            const bolsonesActuales = typeof persona.bolsones === "number" ? persona.bolsones : 1;

            await updateDoc(personaRef, {
                bolsones: bolsonesActuales + 1,
                fechaUltimaEntrega: new Date().toLocaleDateString(),
            });

            setDni("");
            setNombre("");
            setApellido("");
            setPersona(null);
            setShowConfirmacion(false);
            dniInputRef.current.focus();
        } catch (error) {
            console.error("Error al actualizar la entrega: ", error);
        }
    };

    const handleCancelarEntrega = () => {
        setDni("");
        setNombre("");
        setApellido("");
        setPersona(null);
        setShowConfirmacion(false);
        dniInputRef.current.focus();
    };

    return (
        <Card className="mt-4 custom-card">
            <Card.Body>
                <Form>
                    <Form.Group>
                        <Form.Label className="form-label">Tipo de búsqueda</Form.Label>
                        <Form.Select
                            value={tipoBusqueda}
                            onChange={(e) => setTipoBusqueda(e.target.value)}
                            className="form-input"
                        >
                            <option value="dni">DNI</option>
                            <option value="nombreApellido">Nombre y Apellido</option>
                        </Form.Select>
                    </Form.Group>

                    {tipoBusqueda === "dni" ? (
                        <Form.Group>
                            <Form.Label className="form-label"></Form.Label>
                            <Form.Control
                                type="text"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                placeholder="Ingrese DNI"
                                ref={dniInputRef}
                                className="form-input"
                            />
                        </Form.Group>
                    ) : (
                        <>
                            <Form.Group>
                                <Form.Label className="form-label">Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Ingrese nombre"
                                    className="form-input"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="form-label">Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                    placeholder="Ingrese apellido"
                                    className="form-input"
                                />
                            </Form.Group>
                        </>
                    )}

                    <Button onClick={buscarPersona} className="mt-3 search-button">
                        Buscar
                    </Button>
                </Form>

                {error && <p className="text-danger mt-3 error-message">{error}</p>}

                {persona && (
                    <div ref={userInfoRef} className="mt-3 user-info-card">
                        <p className="info-text" style={{ fontWeight: 500 }}>Nombre: {persona.nombre} {persona.apellido}</p>
                        <p className="info-text" style={{ fontWeight: 500 }}>Dirección: {persona.direccion}</p>
                        <p className="info-text" style={{ fontWeight: 500 }}>Última Fecha: {persona.fechaUltimaEntrega}</p>
                        <p className="info-text" style={{ fontWeight: 500, color: persona.bolsones >= 5 ? "red" : "green" }}>
                            Bolsones retirados: {persona.bolsones}
                        </p>
                        <p className="info-text" style={{ fontWeight: 500 }}>Observación: {persona.observaciones}</p>
                        <Button onClick={() => setShowConfirmacion(true)} className="mt-3 deliver-button">
                            Entregar Bolsón
                        </Button>
                    </div>
                )}

                {showConfirmacion && (
                    <Alert ref={confirmacionRef} variant="info" className="mt-3 confirmation-alert">
                        <Alert.Heading className="alert-heading">Confirmar Entrega</Alert.Heading>
                        <p className="alert-text">¿Estás seguro de que deseas confirmar la entrega del bolsón?</p>
                        <Button variant="success" onClick={handleConfirmarEntrega} className="confirm-button">
                            Sí
                        </Button>
                        <Button variant="danger" onClick={handleCancelarEntrega} className="cancel-button ms-2">
                            No
                        </Button>
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
};

export default Buscador;