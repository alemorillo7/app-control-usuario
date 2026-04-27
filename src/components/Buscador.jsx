import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { collection, query, where, getDocs, updateDoc, doc, limit } from "firebase/firestore";
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
        const dniLimpio = dni.trim();
        const nombreLimpio = nombre.trim();
        const apellidoLimpio = apellido.trim();

        if (tipoBusqueda === "dni" && !dniLimpio) {
            setError("Ingrese un DNI válido.");
            return;
        }

        if (tipoBusqueda === "nombreApellido" && (!nombreLimpio || !apellidoLimpio)) {
            setError("Ingrese nombre y apellido.");
            return;
        }
        
        setIsLoading(true);
        setError("");
        setPersona(null);

        try {
            let q;
            if (tipoBusqueda === "dni") {
                q = query(collection(db, "personas"), where("dni", "==", dniLimpio), limit(1));
            } else {
                // Mejora: Usar filtros de Firestore en lugar de traer toda la colección
                q = query(
                    collection(db, "personas"), 
                    where("nombre", "==", nombreLimpio), 
                    where("apellido", "==", apellidoLimpio),
                    limit(1)
                );
            }

            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const docSnap = querySnapshot.docs[0];
                setPersona({ id: docSnap.id, ...docSnap.data() });
            } else {
                setError("No se encontró el registro 😕");
            }
        } catch (error) {
            console.error(error);
            setError("Error en la búsqueda 📡");
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
        } catch (error) {
            setError("Error al confirmar.");
        } finally {
            setIsUpdating(false);
        }
    }, [persona]);

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto space-y-10 animate-fade-up">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto shadow-glow">
                        <UserSearch className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900">
                        Buscador <span className="text-primary-600">ADA</span> 🔍
                    </h2>
                </div>

                <div className="glass-card p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Método</label>
                            <select
                                value={tipoBusqueda}
                                onChange={(e) => setTipoBusqueda(e.target.value)}
                                className="input-modern !py-3"
                            >
                                <option value="dni">🆔 Por DNI</option>
                                <option value="nombreApellido">👤 Por Nombre</option>
                            </select>
                        </div>

                        {tipoBusqueda === "dni" ? (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Número de DNI</label>
                                <input
                                    type="text"
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value)}
                                    placeholder="DNI..."
                                    className="input-modern !py-3"
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="input-modern !py-3" />
                                <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" className="input-modern !py-3" />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={buscarPersonaOptimizada}
                        className="btn-primary-3d w-full flex items-center justify-center gap-2 !py-4"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        {isLoading ? 'Buscando...' : 'Buscar 🚀'}
                    </button>
                </div>

                {persona && (
                    <div className="glass-card overflow-hidden animate-fade-up">
                        <div className="bg-primary-500 p-8 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black">{persona.nombre} {persona.apellido}</h3>
                                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">DNI: {persona.dni}</p>
                            </div>
                            <div className="bg-white/20 p-4 rounded-2xl text-center min-w-[100px]">
                                <p className="text-[10px] font-black uppercase">📦 Total</p>
                                <p className="text-2xl font-black">{persona.bolsones || 0}</p>
                            </div>
                        </div>

                        <div className="p-8 grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-primary-500" />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">📍 Dirección</p>
                                        <p className="font-bold">{persona.direccion || 'No registrada'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-primary-500" />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">🗓️ Última Entrega</p>
                                        <p className="font-bold">{persona.fechaUltimaEntrega || 'Sin registros'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 italic text-sm text-slate-600">
                                {persona.observacion || "Sin notas adicionales."}
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-100">
                            <button onClick={() => setShowConfirmacion(true)} className="btn-primary-3d w-full">REGISTRAR ENTREGA ✅</button>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-white p-4 rounded-2xl border-l-4 border-red-500 shadow-sm animate-fade-up">
                        <p className="font-black text-red-600 text-sm uppercase tracking-widest text-center">{error}</p>
                    </div>
                )}
            </div>

            {showConfirmacion && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                    <div className="glass-card max-w-sm w-full p-10 text-center space-y-6">
                        <Package className="w-16 h-16 text-primary-500 mx-auto animate-bounce" />
                        <h3 className="text-2xl font-black">¿Confirmar entrega?</h3>
                        <div className="flex gap-3">
                            <button onClick={() => setShowConfirmacion(false)} className="btn-secondary-modern flex-1">No</button>
                            <button onClick={handleConfirmarEntrega} className="btn-primary-3d flex-1">Sí ✅</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuscadorModerno;
