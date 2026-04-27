import { useEffect, useState, useCallback, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { Users, Package, Calendar, TrendingUp, BarChart3, RefreshCw, Loader2, Activity, Sparkles, PieChart, Clock } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const InformacionBolsonesModerno = () => {
    const [totalFamilias, setTotalFamilias] = useState(0);
    const [totalBolsones, setTotalBolsones] = useState(0);
    const [loading, setLoading] = useState(true);
    const [datosDetallados, setDatosDetallados] = useState([]);
    const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "personas"));
            const datos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setTotalFamilias(datos.length);
            setTotalBolsones(datos.reduce((sum, p) => sum + (p.bolsones || 0), 0));
            setDatosDetallados(datos);
            setUltimaActualizacion(new Date());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const metricas = useMemo(() => {
        if (datosDetallados.length === 0) return null;
        const promedio = totalFamilias > 0 ? (totalBolsones / totalFamilias).toFixed(1) : 0;
        const max = Math.max(...datosDetallados.map(p => p.bolsones || 0));
        const fechas = datosDetallados
            .map(p => p.fechaUltimaEntrega)
            .filter(f => f && f !== "-")
            .sort((a, b) => {
                const partsA = a.split('/');
                const partsB = b.split('/');
                if (partsA.length === 3 && partsB.length === 3) {
                    return new Date(partsB[2], partsB[1]-1, partsB[0]) - new Date(partsA[2], partsA[1]-1, partsA[0]);
                }
                return 0;
            });
        const fechaUltimaEntregaReal = fechas.length > 0 ? fechas[0] : "Sin datos";
        return { promedio, max, fechaUltimaEntregaReal };
    }, [datosDetallados, totalFamilias, totalBolsones]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto space-y-12 animate-fade-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-200 pb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 font-black text-[10px] uppercase tracking-widest border border-primary-100">
                            <Sparkles className="w-3 h-3" /> Dashboard ADA
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Métricas Social</h1>
                    </div>
                    <button onClick={fetchData} className="btn-primary-3d flex items-center gap-3">
                        <RefreshCw className="w-5 h-5" /> Actualizar Datos
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="glass-card p-10 space-y-6 group">
                        <Users className="w-12 h-12 text-primary-500 group-hover:scale-110 transition-transform" />
                        <div>
                            <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{totalFamilias}</h3>
                            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Familias Activas</p>
                        </div>
                    </div>
                    <div className="glass-card p-10 space-y-6 group">
                        <Package className="w-12 h-12 text-primary-500 group-hover:scale-110 transition-transform" />
                        <div>
                            <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{totalBolsones}</h3>
                            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Recursos Entregados</p>
                        </div>
                    </div>
                    <div className="glass-card p-10 space-y-6 group bg-primary-500/10 border-primary-500/30">
                        <Clock className="w-12 h-12 text-primary-600 group-hover:rotate-12 transition-transform" />
                        <div>
                            <h3 className="text-4xl font-black text-primary-700 tracking-tighter">{metricas?.fechaUltimaEntregaReal}</h3>
                            <p className="text-primary-600 font-black text-xs uppercase tracking-widest">Última Entrega</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-card p-12 space-y-8">
                        <div className="flex items-center gap-3">
                            <Activity className="w-6 h-6 text-primary-500" />
                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Análisis de Impacto</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Promedio/Familia</p>
                                <p className="text-4xl font-black text-slate-900">{metricas?.promedio}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pico de Distribución</p>
                                <p className="text-4xl font-black text-slate-900">{metricas?.max}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900 p-12 rounded-[3.5rem] shadow-3d space-y-8 group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-transparent opacity-50" />
                        <PieChart className="w-12 h-12 text-primary-500 relative z-10" />
                        <div className="space-y-4 relative z-10">
                            <h4 className="text-4xl font-black text-white tracking-tight leading-tight">Estado del Sistema</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-primary-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                                <p className="text-white font-black uppercase tracking-widest text-xs">Conexión en Tiempo Real</p>
                            </div>
                            <p className="text-slate-300 font-medium text-base leading-relaxed max-w-md">
                                Los datos reflejan la actividad total histórica desde la puesta en marcha del sistema de gestión ADA. Sincronización en la nube activa.
                            </p>
                        </div>
                        <Calendar className="absolute -right-10 -bottom-10 w-40 h-40 text-white/5 -rotate-12" />
                    </div>
                </div>

                {ultimaActualizacion && (
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                        Corte de control: {ultimaActualizacion.toLocaleTimeString()}
                    </p>
                )}
            </div>
        </div>
    );
};

export default InformacionBolsonesModerno;
