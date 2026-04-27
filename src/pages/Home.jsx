import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, UserPlus, BarChart3, ChevronRight, Heart, Sparkles, Quote } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        {
            title: "Buscador Inteligente",
            desc: "Localiza familias instantáneamente por DNI o nombre.",
            icon: Search,
            link: "/buscador",
            color: "bg-emerald-500",
        },
        {
            title: "Registro Rápido",
            desc: "Alta de nuevos beneficiarios con validación automática.",
            icon: UserPlus,
            link: "/agregar",
            color: "bg-primary-500",
        },
        {
            title: "Dashboard Social",
            desc: "Visualiza el impacto real con métricas avanzadas.",
            icon: BarChart3,
            link: "/informacion",
            color: "bg-green-600",
        },
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden">
            <div className="max-w-6xl mx-auto space-y-24 relative z-10">
                {/* Hero Section */}
                <header className="text-center space-y-8 max-w-4xl mx-auto">
                    <div className={cn(
                        "inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-50 text-primary-600 font-black text-[10px] uppercase tracking-[0.2em] border border-primary-100 transition-all duration-1000",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}>
                        <Sparkles className="w-3.5 h-3.5" />
                        Plataforma Social ADA
                    </div>
                    
                    <h1 className={cn(
                        "text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] transition-all duration-1000 delay-100",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    )}>
                        Servir con <span className="text-primary-500">Excelencia</span>.
                    </h1>
                    
                    <p className={cn(
                        "text-lg text-slate-500 font-medium max-w-2xl mx-auto transition-all duration-1000 delay-200 leading-relaxed",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    )}>
                        Optimizando la entrega de recursos para que la ayuda llegue <br className="hidden md:block" /> con precisión y transparencia a cada hogar.
                    </p>

                    <div className={cn(
                        "flex flex-wrap items-center justify-center gap-4 transition-all duration-1000 delay-300",
                        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    )}>
                        <Link to="/buscador" className="btn-primary-3d flex items-center gap-2 group">
                            Comenzar Búsqueda
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/informacion" className="btn-secondary-modern">
                            Ver Dashboard
                        </Link>
                    </div>
                </header>

                {/* Versículo Glass Moderno */}
                <section className={cn(
                    "relative max-w-4xl mx-auto transition-all duration-1000 delay-500",
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}>
                    <div className="glass-card p-12 md:p-16 text-center relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/30 rounded-full blur-3xl -mr-16 -mt-16" />
                        
                        <Quote className="w-12 h-12 text-primary-100 mx-auto mb-8" />
                        
                        <blockquote className="space-y-6">
                            <p className="text-2xl md:text-4xl font-black text-slate-800 leading-tight tracking-tight">
                                "Más bienaventurado es <span className="text-primary-500">dar que recibir</span>."
                            </p>
                            <footer className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] italic">
                                — Hechos 20:35
                            </footer>
                        </blockquote>
                    </div>
                </section>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {features.map((item, idx) => (
                        <Link 
                            key={idx} 
                            to={item.link}
                            className="glass-card p-8 space-y-6 group animate-fade-up border-none bg-white/50"
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500",
                                item.color
                            )}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                            <div className="pt-2 flex items-center text-primary-600 font-black text-[10px] uppercase tracking-widest group-hover:gap-2 transition-all">
                                Explorar <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                        </Link>
                    ))}
                </div>

                <footer className="text-center pt-12">
                    <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        <Heart className="w-3 h-3 text-red-400" />
                        Gestión con Compromiso Social
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Home;
