import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Search, User, MapPin, Calendar, Package, CheckCircle, XCircle, AlertTriangle, Loader2, Info, UserSearch, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const BuscadorModerno = () => {
    const [tipoBusqueda, setTipoBusqueda] = useState("dni");
    const [dni, setDni] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [persona, setPersona] = useState(null);
    const [error, setError] = useState("");
    const [showConfirmacion, setShowConfirmacion] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const dniInputRef = useRef(null);

    const buscarPersonaOptimizada = useCallback(async () => {
        if (tipoBusqueda === "dni" && !dni.trim()) {
            setError("Ingrese un DNI válido.");
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
                        personaEncontrada = { id: doc.id, ...doc.data() };
                    });
                }
            } else {
                q = query(collection(db, "personas"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.nombre?.toLowerCase().trim() === nombre.trim().toLowerCase() && 
                        data.apellido?.toLowerCase().trim() === apellido.trim().toLowerCase()) {
                        personaEncontrada = { id: doc.id, ...data };
                    }
                });
            }

            if (personaEncontrada) {
                setPersona(personaEncontrada);
            } else {
                setError("No se encontró el registro 😕");
            }
        } catch (error) {
            setError("Error de conexión 📡");
        } finally {
            setIsLoading(false);
        }
    }, [tipoBusqueda, dni, nombre, apellido]);

    const handleConfirmarEntrega = useCallback(async () => {
        if (!persona?.id) return;
        setIsUpdating(true);
        try {
            const personaRef = doc(db, "personas", persona.id);
            await updateDoc(personaRef, {
                bolsones: (persona.bolsones || 0) + 1,
                fechaUltimaEntrega: new Date().toLocaleDateString(),
            });
            setPersona(null);
            setShowConfirmacion(false);
            setError("");
            alert("¡Entrega registrada con éxito! ✅");
        } catch (error) {
            setError("Error al confirmar.");
        } finally {
            setIsUpdating(false);
        }
    }, [persona]);

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto space-y-10 animate-fade-up">
                {/* Header dinámico */}
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-glow rotate-3 transition-transform hover:rotate-0">
                        <UserSearch className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter text-slate-900">
                        Buscador <span className="text-primary-600">ADA</span> 🔍
                    </h2>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.2em]">Encuentra y registra entregas rápidamente</p>
                </div>

                {/* Card de Búsqueda con Emojis */}
                <div className="glass-card p-10 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Search className="w-32 h-32" />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                                🛠️ Método
                            </label>
                            <select
                                value={tipoBusqueda}
                                onChange={(e) => setTipoBusqueda(e.target.value)}
                                className="input-modern bg-white/50 backdrop-blur-sm"
                            >
                                <option value="dni">🆔 Buscar por DNI</option>
                                <option value="nombreApellido">👤 Nombre y Apellido</option>
                            </select>
                        </div>

                        {tipoBusqueda === "dni" ? (
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                                    🔢 Número de DNI
                                </label>
                                <input
                                    type="text"
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value)}
                                    placeholder="Escribe el DNI aquí..."
                                    className="input-modern"
                                    autoComplete="off"
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Nombre</label>
                                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="input-modern" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Apellido</label>
                                    <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} className="input-modern" />
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={buscarPersonaOptimizada}
                        className="btn-primary-3d w-full flex items-center justify-center gap-3 py-5 text-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
                        {isLoading ? 'Buscando...' : '¡Encontrar ahora! 🚀'}
                    </button>
                </div>

                {/* Resultado Visual Impactante */}
                {persona && (
                    <div className="glass-card overflow-hidden animate-fade-up border-primary-200">
                        <div className="bg-gradient-to-r from-primary-500 to-emerald-600 p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl">
                                    <User className="w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black tracking-tight leading-none mb-2">{persona.nombre} {persona.apellido}</h3>
                                    <span className="bg-black/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">🆔 {persona.dni}</span>
                                </div>
                            </div>
                            <div className="bg-white text-primary-600 p-6 rounded-[2rem] text-center min-w-[140px] shadow-glow">
                                <p className="text-[10px] font-black uppercase tracking-tighter mb-1">Entregas Totales</p>
                                <p className="text-4xl font-black">📦 {persona.bolsones || 0}</p>
                            </div>
                        </div>

                        <div className="p-10 grid md:grid-cols-2 gap-10 bg-white/50">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-slate-100 rounded-2xl group-hover:bg-primary-100 transition-colors">
                                        <MapPin className="w-6 h-6 text-slate-400 group-hover:text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">📍 Ubicación</p>
                                        <p className="text-lg font-bold text-slate-700">{persona.direccion || 'No registrada'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-slate-100 rounded-2xl group-hover:bg-primary-100 transition-colors">
                                        <Calendar className="w-6 h-6 text-slate-400 group-hover:text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">🗓️ Última Entrega</p>
                                        <p className="text-lg font-bold text-slate-700">{persona.fechaUltimaEntrega || 'Primera vez'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-primary-50/50 p-6 rounded-3xl border border-primary-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <Info className="w-4 h-4 text-primary-600" />
                                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Nota Administrativa</p>
                                </div>
                                <p className="text-sm italic text-slate-600 leading-relaxed font-medium">
                                    {persona.observacion || "Sin observaciones adicionales para este registro."}
                                </p>
                            </div>
                        </div>

                        <div className="p-10 bg-slate-50/80 border-t border-slate-100">
                            <button 
                                onClick={() => setShowConfirmacion(true)} 
                                className="btn-primary-3d w-full py-6 text-xl flex items-center justify-center gap-3"
                            >
                                <CheckCircle className="w-7 h-7" />
                                REGISTRAR ENTREGA ✅
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-white/90 backdrop-blur-md border-l-8 border-red-500 p-6 rounded-3xl shadow-xl animate-fade-up">
                        <div className="flex items-center gap-4">
                            <div className="bg-red-100 p-2 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <p className="font-black text-slate-800 uppercase tracking-tight">{error}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Confirmación Animado */}
            {showConfirmacion && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl animate-fade-in">
                    <div className="glass-card max-w-sm w-full p-12 text-center space-y-8 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl" />
                        <Package className="w-20 h-20 text-primary-500 mx-auto animate-bounce" />
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black tracking-tighter">¿Todo listo?</h3>
                            <p className="text-slate-500 font-medium">Estás a punto de registrar un nuevo bolsón para {persona?.nombre}.</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setShowConfirmacion(false)} className="btn-secondary-modern flex-1">Aún no</button>
                            <button onClick={handleConfirmarEntrega} className="btn-primary-3d flex-1">¡Sí, listo! ✅</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuscadorModerno;
