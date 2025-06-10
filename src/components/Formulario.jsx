import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {  Form, Modal } from "react-bootstrap";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import "../estilos/formulario.css"; // Importar los estilos modernos

const FormularioModerno = () => {
    // Estados principales del formulario
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [dni, setDni] = useState("");
    const [direccion, setDireccion] = useState("");
    const [observacion, setObservacion] = useState("");
    
    // Estados de mensajes y autenticación
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Estados de rendimiento y UX
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    // Referencias para manejo de focus
    const nombreInputRef = useRef(null);
    const usernameInputRef = useRef(null);
    const submitTimeoutRef = useRef(null);

    // Credenciales de administrador (memoizadas para rendimiento)
    const adminCredentials = useMemo(() => ({
        username: "admin",
        password: "Ada2025",
    }), []);

    // Efecto para focus automático en el modal de login
    useEffect(() => {
        if (showLoginModal && usernameInputRef.current) {
            const timer = setTimeout(() => {
                usernameInputRef.current?.focus();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [showLoginModal]);

    // Efecto para focus automático después del login
    useEffect(() => {
        if (isAuthenticated && nombreInputRef.current) {
            const timer = setTimeout(() => {
                nombreInputRef.current?.focus();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated]);

    // Función de validación de campos optimizada
    const validarCampos = useCallback(() => {
        const errores = {};
        
        if (!nombre.trim()) {
            errores.nombre = "El nombre es obligatorio";
        } else if (nombre.trim().length < 2) {
            errores.nombre = "El nombre debe tener al menos 2 caracteres";
        }
        
        if (!apellido.trim()) {
            errores.apellido = "El apellido es obligatorio";
        } else if (apellido.trim().length < 2) {
            errores.apellido = "El apellido debe tener al menos 2 caracteres";
        }
        
        if (!dni.trim()) {
            errores.dni = "El DNI es obligatorio";
        } else if (!/^\d{7,8}$/.test(dni.trim())) {
            errores.dni = "El DNI debe tener 7 u 8 dígitos";
        }

        setFieldErrors(errores);
        return Object.keys(errores).length === 0;
    }, [nombre, apellido, dni]);

    // Función de validación de DNI optimizada
    const validarDNI = useCallback(async () => {
        setIsValidating(true);
        try {
            const q = query(collection(db, "personas"), where("dni", "==", dni.trim()));
            const querySnapshot = await getDocs(q);
            return querySnapshot.empty;
        } catch (error) {
            console.error("Error al validar DNI:", error);
            throw new Error("Error al verificar el DNI en la base de datos");
        } finally {
            setIsValidating(false);
        }
    }, [dni]);

    // Función de login optimizada
    const handleLogin = useCallback(async () => {
        if (!username.trim() || !password.trim()) {
            setError("Por favor, complete todos los campos");
            return;
        }

        setIsLoading(true);
        setError("");

        // Simular delay de autenticación para mejor UX
        await new Promise(resolve => setTimeout(resolve, 800));

        if (username.trim() === adminCredentials.username && password === adminCredentials.password) {
            setIsAuthenticated(true);
            setShowLoginModal(false);
            setError("");
            setUsername("");
            setPassword("");
        } else {
            setError("Usuario o contraseña incorrectos");
        }
        
        setIsLoading(false);
    }, [username, password, adminCredentials]);

    // Función para agregar usuario optimizada
    const agregarUsuario = useCallback(async () => {
        setError("");
        setMensaje("");

        if (!validarCampos()) {
            setError("Por favor, corrija los errores en el formulario");
            return;
        }

        setIsLoading(true);

        try {
            const dniDisponible = await validarDNI();
            if (!dniDisponible) {
                setError("El DNI ya está registrado en el sistema");
                setIsLoading(false);
                return;
            }

            const nuevaPersona = {
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                dni: dni.trim(),
                direccion: direccion.trim() || "",
                observacion: observacion.trim() || "",
                bolsones: 1,
                fechaUltimaEntrega: new Date().toLocaleDateString(),
                fechaRegistro: new Date().toISOString(),
            };

            await addDoc(collection(db, "personas"), nuevaPersona);

            setMensaje("Usuario agregado correctamente al sistema");
            
            // Limpiar formulario
            setNombre("");
            setApellido("");
            setDni("");
            setDireccion("");
            setObservacion("");
            setFieldErrors({});

            // Focus en el primer campo después de un delay
            setTimeout(() => {
                if (nombreInputRef.current) {
                    nombreInputRef.current.focus();
                }
            }, 1000);

        } catch (error) {
            console.error("Error al agregar usuario:", error);
            setError("Error al agregar el usuario. Por favor, intente nuevamente");
        } finally {
            setIsLoading(false);
        }
    }, [nombre, apellido, dni, direccion, observacion, validarCampos, validarDNI]);

    // Función para manejar teclas (Enter para enviar)
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !isLoading) {
            if (showLoginModal) {
                e.preventDefault();
                handleLogin();
            } else {
                e.preventDefault();
                agregarUsuario();
            }
        }
    }, [isLoading, showLoginModal, handleLogin, agregarUsuario]);

    // Función para cerrar sesión
    const handleLogout = useCallback(() => {
        setIsAuthenticated(false);
        setShowLoginModal(true);
        setNombre("");
        setApellido("");
        setDni("");
        setDireccion("");
        setObservacion("");
        setMensaje("");
        setError("");
        setFieldErrors({});
        setUsername("");
        setPassword("");
    }, []);

    // Cleanup de timeouts
    useEffect(() => {
        return () => {
            if (submitTimeoutRef.current) {
                clearTimeout(submitTimeoutRef.current);
            }
        };
    }, []);

    // Renderizado del modal de login
    if (!isAuthenticated) {
        return (
            <Modal 
                show={showLoginModal} 
                onHide={() => setShowLoginModal(false)} 
                centered
                className="form-login-modal"
                backdrop="static"
                backdropClassName="form-modal-backdrop"
            >
                <Modal.Header closeButton className="form-modal-header">
                    <Modal.Title className="form-modal-title">
                        Acceso de Administrador
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body className="form-modal-body">
                    <Form>
                        <div className="form-field-group">
                            <label className="form-field-label required">
                                Usuario
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ingrese su usuario"
                                className="form-field-input"
                                ref={usernameInputRef}
                                disabled={isLoading}
                                autoComplete="username"
                            />
                        </div>
                        
                        <div className="form-field-group">
                            <label className="form-field-label required">
                                Contraseña
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ingrese su contraseña"
                                    className="form-field-input"
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                    style={{ paddingRight: '3rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem'
                                    }}
                                    disabled={isLoading}
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        
                        {error && (
                            <div className="form-error-message" role="alert">
                                {error}
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                
                <Modal.Footer className="form-modal-footer">
                    <button
                        onClick={handleLogin}
                        className={`form-login-button ${isLoading ? 'form-loading' : ''}`}
                        disabled={isLoading}
                        aria-label="Iniciar sesión como administrador"
                    >
                        {isLoading ? 'Verificando...' : '🔓 Ingresar'}
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }

    // Renderizado del formulario principal
    return (
        <div className="form-main-container">
            <div className="form-main-body">
                <h2 className="form-main-title">
                    Formulario de Registro
                </h2>
                
                <Form>
                    {/* Campo Nombre */}
                    <div className="form-field-group">
                        <label className="form-field-label required">
                            Nombre
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ingrese el nombre"
                            className={`form-field-input ${fieldErrors.nombre ? 'error' : ''}`}
                            ref={nombreInputRef}
                            disabled={isLoading}
                            autoComplete="given-name"
                        />
                        {fieldErrors.nombre && (
                            <small style={{ color: 'var(--form-danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                                {fieldErrors.nombre}
                            </small>
                        )}
                    </div>

                    {/* Campo Apellido */}
                    <div className="form-field-group">
                        <label className="form-field-label required">
                            Apellido
                        </label>
                        <input
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ingrese el apellido"
                            className={`form-field-input ${fieldErrors.apellido ? 'error' : ''}`}
                            disabled={isLoading}
                            autoComplete="family-name"
                        />
                        {fieldErrors.apellido && (
                            <small style={{ color: 'var(--form-danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                                {fieldErrors.apellido}
                            </small>
                        )}
                    </div>

                    {/* Campo DNI */}
                    <div className="form-field-group">
                        <label className="form-field-label required">
                            DNI
                        </label>
                        <input
                            type="text"
                            value={dni}
                            onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                            onKeyPress={handleKeyPress}
                            placeholder="Ingrese el número de DNI"
                            className={`form-field-input ${fieldErrors.dni ? 'error' : ''}`}
                            disabled={isLoading || isValidating}
                            maxLength="8"
                            autoComplete="off"
                        />
                        {fieldErrors.dni && (
                            <small style={{ color: 'var(--form-danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                                {fieldErrors.dni}
                            </small>
                        )}
                        {isValidating && (
                            <small style={{ color: 'var(--form-info)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                                🔍 Verificando DNI...
                            </small>
                        )}
                    </div>

                    {/* Campo Dirección */}
                    <div className="form-field-group">
                        <label className="form-field-label">
                            Dirección
                        </label>
                        <input
                            type="text"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ingrese la dirección (opcional)"
                            className="form-field-input"
                            disabled={isLoading}
                            autoComplete="street-address"
                        />
                    </div>

                    {/* Campo Observación */}
                    <div className="form-field-group">
                        <label className="form-field-label">
                            Observación
                        </label>
                        <textarea
                            value={observacion}
                            onChange={(e) => setObservacion(e.target.value)}
                            placeholder="Ingrese observaciones adicionales (opcional)"
                            className="form-field-input"
                            disabled={isLoading}
                            rows="3"
                            style={{ resize: 'vertical', minHeight: '80px' }}
                        />
                    </div>

                    {/* Botón de envío */}
                    <button
                        type="button"
                        onClick={agregarUsuario}
                        className={`form-submit-button ${isLoading ? 'form-loading' : ''}`}
                        disabled={isLoading || isValidating}
                        aria-label="Agregar nuevo usuario al sistema"
                    >
                        {isLoading ? 'Agregando Usuario...' : '👤 Agregar Usuario'}
                    </button>

                    {/* Mensaje de campos requeridos */}
                    <div className="form-required-message">
                        <span className="form-required-icon">*</span>
                        Campos obligatorios
                    </div>

                    {/* Botón de cerrar sesión (opcional) */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                            background: 'linear-gradient(135deg, var(--form-danger), #dc2626)',
                            border: 'none',
                            borderRadius: 'var(--form-radius-md)',
                            padding: '0.75rem 1.5rem',
                            color: 'white',
                            cursor: 'pointer',
                            marginTop: '1rem',
                            width: '100%',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            transition: 'var(--form-transition)'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = 'var(--form-shadow-md)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                        aria-label="Cerrar sesión de administrador"
                    >
                        🚪 Cerrar Sesión
                    </button>
                </Form>

                {/* Mensajes de éxito y error */}
                {error && (
                    <div className="form-error-message" role="alert">
                        {error}
                    </div>
                )}
                
                {mensaje && (
                    <div className="form-success-message" role="alert">
                        {mensaje}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormularioModerno;

