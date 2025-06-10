import { useEffect, useState } from "react";
import "../estilos/home.css"; // Importar los estilos modernos

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Efecto para la animación de entrada
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    // Efecto para seguir el mouse (parallax sutil)
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Función para manejar el clic en el versículo (opcional)
    const handleVerseClick = () => {
        // Aquí podrías agregar funcionalidad como copiar al portapapeles
        // o mostrar más información sobre el versículo
        console.log("Versículo seleccionado");
    };

    return (
        <div 
            className="home-container"
            style={{
                '--mouse-x': `${mousePosition.x}%`,
                '--mouse-y': `${mousePosition.y}%`
            }}
        >
            {/* Efectos de luz flotantes */}
            <div className="light-effect"></div>
            <div className="light-effect"></div>

            {/* Contenedor principal del versículo */}
            <div 
                className={`bible-verse-modern ${isVisible ? 'visible' : ''}`}
                onClick={handleVerseClick}
                role="article"
                aria-label="Versículo bíblico inspiracional"
                tabIndex="0"
            >
                {/* Icono decorativo */}
                <div className="verse-icon" aria-hidden="true">
                    ✨
                </div>

                {/* Texto principal del versículo */}
                <h1 className="verse-text-modern">
                    Mas bienaventurado es dar que recibir.
                </h1>

                {/* Referencia bíblica */}
                <cite className="verse-reference-modern">
                    Hechos 20:35
                </cite>

                {/* Elementos decorativos adicionales */}
                <div className="verse-decorations" aria-hidden="true">
                    <div className="decoration-dot decoration-dot-1"></div>
                    <div className="decoration-dot decoration-dot-2"></div>
                    <div className="decoration-dot decoration-dot-3"></div>
                </div>
            </div>

            {/* Información adicional (opcional) */}
            <div className="verse-context" style={{ display: 'none' }}>
                <p>
                    Este versículo forma parte del discurso de despedida del apóstol Pablo 
                    a los ancianos de Éfeso, recordándoles las palabras de Jesús sobre 
                    la bendición de dar.
                </p>
            </div>
        </div>
    );
};

export default Home;

