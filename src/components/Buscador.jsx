import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Form } from "react-bootstrap";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import "../estilos/buscador.css"; // Importar los estilos modernos

const BuscadorModerno = () => {
    // Estados principales
    const [tipoBusqueda, setTipoBusqueda] = useState("dni");
    const [dni, setDni] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [persona, setPersona] = useState(null);
    const [error, setError] = useState("");
    const [showConfirmacion, setShowConfirmacion] = useState(false);
    
    // Estados de rendimiento
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Referencias para scroll y focus
    const dniInputRef = useRef(null);
    const userInfoRef = useRef(null);
    const confirmacionRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Efecto para scroll suave al mostrar confirmación
    useEffect(() => {
        if (showConfirmacion && confirmacionRef.current) {
            const timer = setTimeout(() => {
                confirmacionRef.current.scrollIntoView({ 
                    behavior: "smooth", 
                    block: "center" 
                });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [showConfirmacion]);

    // Efecto para scroll suave al mostrar información del usuario
    useEffect(() => {
        if (persona && userInfoRef.current) {
            const timer = setTimeout(() => {
                userInfoRef.current.scrollIntoView({ 
                    behavior: "smooth", 
                    block: "start" 
                });
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [persona]);

    // Función de búsqueda optimizada con debounce
    const buscarPersonaOptimizada = useCallback(async () => {
        // Validaciones previas
        if (tipoBusqueda === "dni" && !dni.trim()) {
            setError("Por favor, ingrese un DNI válido.");
            return;
        }
        
        if (tipoBusqueda === "nombreApellido" && (!nombre.trim() || !apellido.trim())) {
            setError("Por favor, ingrese nombre y apellido.");
            return;
        }

        setIsLoading(true);
        setError("");
        setPersona(null);

        try {
            let q;
            let personaEncontrada = null;

            if (tipoBusqueda === "dni") {
                q = query(collection(db, "personas"), where("dni", "==", dni.trim()));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const bolsones = typeof data.bolsones === "number" ? data.bolsones : 1;
                        personaEncontrada = { id: doc.id, ...data, bolsones };
                    });
                }
            } else {
                // Búsqueda por nombre y apellido optimizada
                const nombreBusqueda = nombre.trim().toLowerCase();
                const apellidoBusqueda = apellido.trim().toLowerCase();
                
                q = query(collection(db, "personas"));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const nombreFirestore = data.nombre?.toLowerCase().trim() || "";
                        const apellidoFirestore = data.apellido?.toLowerCase().trim() || "";

                        if (nombreFirestore === nombreBusqueda && apellidoFirestore === apellidoBusqueda) {
                            const bolsones = typeof data.bolsones === "number" ? data.bolsones : 1;
                            personaEncontrada = { id: doc.id, ...data, bolsones };
                        }
                    });
                }
            }

            if (personaEncontrada) {
                setPersona(personaEncontrada);
                setError("");
            } else {
                setError("No se encontró ninguna persona con los datos proporcionados.");
                setPersona(null);
            }

        } catch (error) {
            console.error("Error al buscar persona:", error);
            setError("Error al realizar la búsqueda. Por favor, intente nuevamente.");
            setPersona(null);
        } finally {
            setIsLoading(false);
        }
    }, [tipoBusqueda, dni, nombre, apellido]);

    // Función de búsqueda con debounce
    const buscarPersona = useCallback(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        searchTimeoutRef.current = setTimeout(() => {
            buscarPersonaOptimizada();
        }, 300);
    }, [buscarPersonaOptimizada]);

    // Función para confirmar entrega optimizada
    const handleConfirmarEntrega = useCallback(async () => {
        if (!persona?.id) return;

        setIsUpdating(true);
        try {
            const personaRef = doc(db, "personas", persona.id);
            const bolsonesActuales = typeof persona.bolsones === "number" ? persona.bolsones : 1;

            await updateDoc(personaRef, {
                bolsones: bolsonesActuales + 1,
                fechaUltimaEntrega: new Date().toLocaleDateString(),
            });

            // Limpiar formulario y estados
            setDni("");
            setNombre("");
            setApellido("");
            setPersona(null);
            setShowConfirmacion(false);
            setError("");
            
            // Focus en el input principal
            setTimeout(() => {
                if (dniInputRef.current) {
                    dniInputRef.current.focus();
                }
            }, 100);

        } catch (error) {
            console.error("Error al actualizar la entrega:", error);
            setError("Error al confirmar la entrega. Por favor, intente nuevamente.");
        } finally {
            setIsUpdating(false);
        }
    }, [persona]);

    // Función para cancelar entrega
    const handleCancelarEntrega = useCallback(() => {
        setDni("");
        setNombre("");
        setApellido("");
        setPersona(null);
        setShowConfirmacion(false);
        setError("");
        
        setTimeout(() => {
            if (dniInputRef.current) {
                dniInputRef.current.focus();
            }
        }, 100);
    }, []);

    // Función para cambiar tipo de búsqueda
    const handleTipoBusquedaChange = useCallback((e) => {
        const nuevoTipo = e.target.value;
        setTipoBusqueda(nuevoTipo);
        setDni("");
        setNombre("");
        setApellido("");
        setPersona(null);
        setError("");
        setShowConfirmacion(false);
    }, []);

    // Manejo de teclas para mejor UX
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !isLoading) {
            e.preventDefault();
            buscarPersona();
        }
    }, [buscarPersona, isLoading]);

    // Memoización del indicador de bolsones
    const bolsonesIndicator = useMemo(() => {
        if (!persona) return null;
        
        const bolsones = persona.bolsones || 0;
        const isWarning = bolsones >= 5;
        
        return (
            <span className={`search-bolsones-indicator ${isWarning ? 'search-bolsones-warning' : 'search-bolsones-normal'}`}>
                {isWarning ? '⚠️' : '✅'} {bolsones} bolsones
            </span>
        );
    }, [persona]);

    // Cleanup de timeouts
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="search-main-container">
            {/* Título del buscador */}
            <h2 className="search-title">
                🔍 Buscador de Personas
            </h2>

            <Form>
                {/* Selector de tipo de búsqueda */}
                <div className="search-form-group">
                    <label className="search-form-label">
                        Tipo de búsqueda
                    </label>
                    <select
                        value={tipoBusqueda}
                        onChange={handleTipoBusquedaChange}
                        className="search-form-select"
                        disabled={isLoading}
                    >
                        <option value="dni">Buscar por DNI</option>
                        <option value="nombreApellido">Buscar por Nombre y Apellido</option>
                    </select>
                </div>

                {/* Campos de búsqueda condicionales */}
                {tipoBusqueda === "dni" ? (
                    <div className="search-form-group">
                        <label className="search-form-label">
                            Número de DNI
                        </label>
                        <input
                            type="text"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ingrese el número de DNI"
                            ref={dniInputRef}
                            className="search-form-input"
                            disabled={isLoading}
                            autoComplete="off"
                        />
                    </div>
                ) : (
                    <>
                        <div className="search-form-group">
                            <label className="search-form-label">
                                Nombre
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ingrese el nombre"
                                className="search-form-input"
                                disabled={isLoading}
                                autoComplete="given-name"
                            />
                        </div>
                        <div className="search-form-group">
                            <label className="search-form-label">
                                Apellido
                            </label>
                            <input
                                type="text"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ingrese el apellido"
                                className="search-form-input"
                                disabled={isLoading}
                                autoComplete="family-name"
                            />
                        </div>
                    </>
                )}

                {/* Botón de búsqueda */}
                <button
                    type="button"
                    onClick={buscarPersona}
                    className={`search-action-button ${isLoading ? 'search-loading' : ''}`}
                    disabled={isLoading}
                    aria-label="Buscar persona"
                >
                    {isLoading ? 'Buscando...' : '🔍 Buscar Persona'}
                </button>
            </Form>

            {/* Mensaje de error */}
            {error && (
                <div className="search-error-message" role="alert">
                    {error}
                </div>
            )}

            {/* Información del usuario encontrado */}
            {persona && (
                <div ref={userInfoRef} className="search-user-info-card">
                    <div className="search-info-text">
                        <span className="search-info-label">👤 Nombre completo:</span>
                        <span className="search-info-value">{persona.nombre} {persona.apellido}</span>
                    </div>
                    
                    <div className="search-info-text">
                        <span className="search-info-label">🏠 Dirección:</span>
                        <span className="search-info-value">{persona.direccion || 'No especificada'}</span>
                    </div>
                    
                    <div className="search-info-text">
                        <span className="search-info-label">📅 Última entrega:</span>
                        <span className="search-info-value">{persona.fechaUltimaEntrega || 'Sin registros'}</span>
                    </div>
                    
                    <div className="search-info-text">
                        <span className="search-info-label">📦 Bolsones retirados:</span>
                        <span className="search-info-value">{bolsonesIndicator}</span>
                    </div>
                    
                    <div className="search-info-text">
                        <span className="search-info-label">📝 Observaciones:</span>
                        <span className="search-info-value">{persona.observacion || persona.observaciones || 'Sin observaciones'}</span>
                    </div>

                    <button
                        onClick={() => setShowConfirmacion(true)}
                        className="search-deliver-button"
                        disabled={isUpdating}
                        aria-label="Entregar bolsón a esta persona"
                    >
                        📦 Entregar Bolsón
                    </button>
                </div>
            )}

            {/* Alert de confirmación */}
            {showConfirmacion && (
                <div ref={confirmacionRef} className="search-confirmation-alert" role="dialog" aria-labelledby="confirm-title">
                    <h3 id="confirm-title" className="search-alert-heading">
                        Confirmar Entrega
                    </h3>
                    <p className="search-alert-text">
                        ¿Estás seguro de que deseas confirmar la entrega del bolsón a <strong>{persona?.nombre} {persona?.apellido}</strong>?
                        <br />
                        <small>Esta acción incrementará el contador de bolsones y actualizará la fecha de entrega.</small>
                    </p>
                    <div className="search-button-group">
                        <button
                            onClick={handleConfirmarEntrega}
                            className={`search-confirm-button ${isUpdating ? 'search-loading' : ''}`}
                            disabled={isUpdating}
                            aria-label="Confirmar entrega del bolsón"
                        >
                            {isUpdating ? 'Procesando...' : '✅ Sí, confirmar'}
                        </button>
                        <button
                            onClick={handleCancelarEntrega}
                            className="search-cancel-button"
                            disabled={isUpdating}
                            aria-label="Cancelar entrega del bolsón"
                        >
                            ❌ No, cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuscadorModerno;

