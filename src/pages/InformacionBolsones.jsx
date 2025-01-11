import { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const InformacionBolsones = () => {
    const [totalFamilias, setTotalFamilias] = useState(0); // Total de familias asistidas
    const [totalBolsones, setTotalBolsones] = useState(0); // Total de bolsones entregados
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(""); // Manejo de errores

    // Obtener datos de Firestore
    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "personas"));
                const datos = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Calcular el total de familias y bolsones
                const familias = datos.length;
                const bolsones = datos.reduce((sum, persona) => sum + (persona.bolsones || 0), 0);


                setTotalFamilias(familias);
                setTotalBolsones(bolsones);
                setLoading(false);
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError("Error al cargar los datos.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Obtener la fecha actual
    const fechaActual = new Date().toLocaleDateString();

    if (loading) {
        return (
            <div className="text-center mt-4">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger" className="mt-4">{error}</Alert>;
    }

    return (
        <Card className="mt-4 shadow custom-card" style={{ maxWidth: "500px", margin: "0 auto" }}>
            <Card.Body>
                <Card.Title className="text-center mb-4" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    Resumen de Entregas
                </Card.Title>
                <Card.Text>
                    <strong>Fecha:</strong> {fechaActual}
                </Card.Text>
                <Card.Text>
                    <strong>Familias Asistidas:</strong> {totalFamilias}
                </Card.Text>
                <Card.Text>
                    <strong>Bolsones Entregados (Total):</strong> {totalBolsones}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default InformacionBolsones;