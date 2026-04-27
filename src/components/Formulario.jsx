import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { User, Lock, Eye, EyeOff, Check, AlertCircle, Loader2, ShieldCheck, LogOut, UserPlus, MapPin, FileText } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const FormularioModerno = () => {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [dni, setDni] = useState("");
    const [direccion, setDireccion] = useState("");
    const [observacion, setObservacion] = useState("");
    
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const nombreInputRef = useRef(null);
    const usernameInputRef = useRef(null);

    const adminCredentials = useMemo(() => ({
        username: "admin",
        password: "Ada2025",
    }), []);

    useEffect(() => {
        if (showLoginModal && usernameInputRef.current) {
            const timer = setTimeout(() => {
                usernameInputRef.current?.focus();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [showLoginModal]);

    const validarCampos = useCallback(() => {
        const errores = {};
        if (!nombre.trim()) errores.nombre = "Obligatorio";
        if (!apellido.trim()) errores.apellido = "Obligatorio";
        if (!dni.trim()) errores.dni = "DNI requerido";
        setFieldErrors(errores);
        return Object.keys(errores).length === 0;
    }, [nombre, apellido, dni]);

    const handleLogin = useCallback(async () => {
        if (!username.trim() || !password.trim()) {
            setError("Complete todos los campos");
            return;
        }
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        if (username.trim() === adminCredentials.username && password === adminCredentials.password) {
            setIsAuthenticated(true);
            setShowLoginModal(false);
            setError("");
        } else {
            setError("Credenciales incorrectas");
        }
        setIsLoading(false);
    }, [username, password, adminCredentials]);

    const agregarUsuario = useCallback(async () => {
        setError("");
        setMensaje("");
        if (!validarCampos()) return;
        setIsLoading(true);
        try {
            const nuevaPersona = {
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                dni: dni.trim(),
                direccion: direccion.trim(),
                observacion: observacion.trim(),
                bolsones: 1,
                fechaUltimaEntrega: new Date().toLocaleDateString(),
                fechaRegistro: new Date().toISOString(),
            };
            await addDoc(collection(db, "personas"), nuevaPersona);
            setMensaje("¡Registro exitoso!");
            setNombre(""); setApellido(""); setDni(""); setDireccion(""); setObservacion("");
        } catch (error) {
            setError("Error al registrar.");
        } finally {
            setIsLoading(false);
        }
    }, [nombre, apellido, dni, direccion, observacion, validarCampos]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            showLoginModal ? handleLogin() : agregarUsuario();
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fade-up">
                <div className="glass-card max-w-sm w-full p-10 space-y-8">
                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-8 h-8 text-primary-600" />
                        </div>
                        <h3 className="text-2xl font-black">Acceso Seguro</h3>
                        <p className="text-slate-500 text-sm font-medium">Solo personal autorizado</p>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Usuario"
                            className="input-modern"
                            ref={usernameInputRef}
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Contraseña"
                                className="input-modern"
                            />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-xs font-black uppercase text-center">{error}</p>}
                        <button onClick={handleLogin} className="btn-primary-3d w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Entrar'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-2xl mx-auto space-y-8 animate-fade-up">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-3xl font-black tracking-tighter">Registro de Usuario</h2>
                    <button onClick={() => setIsAuthenticated(false)} className="btn-secondary-modern !py-2 !px-4">Salir</button>
                </div>

                <div className="glass-card p-10 space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="input-modern" ref={nombreInputRef} />
                        <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" className="input-modern" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} placeholder="DNI" className="input-modern" />
                        <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección" className="input-modern" />
                    </div>
                    <textarea value={observacion} onChange={(e) => setObservacion(e.target.value)} placeholder="Observaciones" className="input-modern min-h-[100px] !rounded-[2rem]" />
                    
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-full text-center text-xs font-black">{error}</div>}
                    {mensaje && <div className="bg-primary-50 text-primary-600 p-3 rounded-full text-center text-xs font-black">{mensaje}</div>}
                    
                    <button onClick={agregarUsuario} className="btn-primary-3d w-full py-5 text-base" disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Registrar Persona'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormularioModerno;
