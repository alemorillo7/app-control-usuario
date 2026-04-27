import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, UserPlus, Info, Menu, X, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const NavbarComponent = () => {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActiveLink = (path) => {
        if (path === "/" && location.pathname === "/") return true;
        if (path !== "/" && location.pathname.startsWith(path)) return true;
        return false;
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 15);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { path: "/buscador", label: "Buscar", icon: Search },
        { path: "/agregar", label: "Registro", icon: UserPlus },
        { path: "/informacion", label: "Dashboard", icon: Info },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-6 pointer-events-none">
            <nav className={cn(
                "mx-auto w-full max-w-5xl pointer-events-auto transition-all duration-500 rounded-full",
                isScrolled 
                    ? "bg-white/80 backdrop-blur-2xl shadow-soft-xl py-2.5 px-6 border border-white/50" 
                    : "bg-transparent py-4 px-2 border-transparent"
            )}>
                <div className="flex items-center justify-between">
                    {/* Logo ADA Verde Flúor */}
                    <Link 
                        to="/" 
                        className="flex items-center gap-2.5 group focus:outline-none"
                    >
                        <div className="w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center shadow-3d group-hover:rotate-6 transition-transform duration-500">
                            <Sparkles className="text-white w-5 h-5" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-slate-900">
                            ADA
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1.5">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActiveLink(link.path);
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={cn(
                                        "flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300",
                                        active 
                                            ? "bg-primary-500 text-white shadow-3d" 
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <Icon className={cn("w-3.5 h-3.5", active ? "text-white" : "text-slate-400")} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Toggle */}
                    <button 
                        className="md:hidden w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-slate-600 active:scale-90"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={cn(
                    "md:hidden absolute top-full left-4 right-4 mt-4 bg-white/95 backdrop-blur-3xl rounded-[2rem] p-6 space-y-2 shadow-soft-xl border border-white transition-all duration-500 origin-top",
                    isMenuOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                )}>
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActiveLink(link.path);
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-2xl text-base font-black uppercase tracking-widest transition-all duration-300",
                                    active 
                                        ? "bg-primary-500 text-white shadow-3d" 
                                        : "text-slate-600"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", active ? "text-white" : "text-slate-400")} />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </header>
    );
};

export default NavbarComponent;