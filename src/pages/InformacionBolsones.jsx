import { useEffect, useState, useCallback, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import "../estilos/informacionbolsones.css"; // Importar los estilos modernos

const InformacionBolsonesModerno = () => {
    // Estados principales
    const [totalFamilias, setTotalFamilias] = useState(0);
    const [totalBolsones, setTotalBolsones] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Estados adicionales para métricas avanzadas
    const [datosDetallados, setDatosDetallados] = useState([]);
    const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
    const [animateNumbers, setAnimateNumbers] = useState(false);

    // Función optimizada para obtener datos de Firestore
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError("");
        
        try {
            const querySnapshot = await getDocs(collection(db, "personas"));
            const datos = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Calcular métricas
            const familias = datos.length;
            const bolsones = datos.reduce((sum, persona) => sum + (persona.bolsones || 0), 0);

            // Actualizar estados
            setDatosDetallados(datos);
            setTotalFamilias(familias);
            setTotalBolsones(bolsones);
            setUltimaActualizacion(new Date());
            
            // Activar animación de números
            setTimeout(() => setAnimateNumbers(true), 300);
            
        } catch (err) {
            console.error("Error al cargar los datos:", err);
            setError("Error al cargar los datos. Por favor, intente nuevamente.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Efecto para cargar datos al montar el componente
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Métricas calculadas memoizadas
    const metricas = useMemo(() => {
        if (datosDetallados.length === 0) return null;

        const promedioBolonesPerFamilia = totalFamilias > 0 ? (totalBolsones / totalFamilias).toFixed(1) : 0;
        const familiasConMasDe3Bolsones = datosDetallados.filter(persona => (persona.bolsones || 0) > 3).length;
        const porcentajeFamiliasActivas = totalFamilias > 0 ? ((familiasConMasDe3Bolsones / totalFamilias) * 100).toFixed(1) : 0;

        return {
            promedioBolonesPerFamilia,
            familiasConMasDe3Bolsones,
            porcentajeFamiliasActivas
        };
    }, [datosDetallados, totalFamilias, totalBolsones]);

    // Función para formatear fecha
    const formatearFecha = useCallback((fecha) => {
        return fecha.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    // Función para manejar actualización manual
    const handleActualizar = useCallback(() => {
        setAnimateNumbers(false);
        fetchData();
    }, [fetchData]);

    // Renderizado del estado de carga
    if (loading) {
        return (
            <div className="info-loading-container">
                <div className="info-loading-spinner"></div>
                <div className="info-loading-text">
                    Cargando información de bolsones...
                </div>
            </div>
        );
    }

    // Renderizado del estado de error
    if (error) {
        return (
            <div className="info-error-container">
                <div className="info-error-icon">⚠️</div>
                <div className="info-error-title">Error al cargar datos</div>
                <div className="info-error-message">{error}</div>
                <button
                    onClick={handleActualizar}
                    style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1.5rem',
                        background: 'var(--info-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--info-radius-md)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'var(--info-transition)'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'var(--info-secondary)'}
                    onMouseOut={(e) => e.target.style.background = 'var(--info-primary)'}
                >
                    🔄 Reintentar
                </button>
            </div>
        );
    }

    // Renderizado principal
    return (
        <div className="info-dashboard-container">
            <div className="info-main-card">
                {/* Header con partículas flotantes */}
                <div className="info-card-header">
                    <div className="info-floating-particles">
                        <div className="info-particle"></div>
                        <div className="info-particle"></div>
                        <div className="info-particle"></div>
                        <div className="info-particle"></div>
                        <div className="info-particle"></div>
                    </div>
                    <h1 className="info-main-title">
                        Dashboard de Entregas
                    </h1>
                    <p className="info-subtitle">
                        Resumen completo de familias asistidas y bolsones entregados
                    </p>
                </div>

                {/* Cuerpo principal */}
                <div className="info-card-body">
                    {/* Grid de estadísticas principales */}
                    <div className="info-stats-grid">
                        {/* Tarjeta de Familias */}
                        <div className="info-stat-card families" tabIndex="0">
                            <div className="info-stat-header">
                                <div className="info-stat-icon">👨‍👩‍👧‍👦</div>
                                <div className="info-stat-trend">
                                    ↗️ Activo
                                </div>
                            </div>
                            <div className={`info-stat-value ${animateNumbers ? 'animate' : ''}`}>
                                {totalFamilias.toLocaleString()}
                            </div>
                            <div className="info-stat-label">Familias Asistidas</div>
                            <div className="info-stat-description">
                                Total de familias registradas en el sistema de asistencia alimentaria
                            </div>
                            {metricas && (
                                <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--info-text-muted)' }}>
                                    📊 {metricas.familiasConMasDe3Bolsones} familias con más de 3 bolsones
                                </div>
                            )}
                        </div>

                        {/* Tarjeta de Bolsones */}
                        <div className="info-stat-card packages" tabIndex="0">
                            <div className="info-stat-header">
                                <div className="info-stat-icon">📦</div>
                                <div className="info-stat-trend">
                                    ↗️ {metricas?.promedioBolonesPerFamilia || 0} promedio
                                </div>
                            </div>
                            <div className={`info-stat-value ${animateNumbers ? 'animate' : ''}`}>
                                {totalBolsones.toLocaleString()}
                            </div>
                            <div className="info-stat-label">Bolsones Entregados</div>
                            <div className="info-stat-description">
                                Cantidad total de bolsones alimentarios distribuidos a las familias
                            </div>
                            {metricas && (
                                <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--info-text-muted)' }}>
                                    📈 {metricas.porcentajeFamiliasActivas}% familias activas ({">"}3 bolsones)
                                </div>
                            )}
                        </div>

                        {/* Tarjeta de Fecha y Actualización */}
                        <div className="info-stat-card date" tabIndex="0">
                            <div className="info-stat-header">
                                <div className="info-stat-icon">📅</div>
                                <button
                                    onClick={handleActualizar}
                                    style={{
                                        background: 'var(--info-accent)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '0.25rem 0.5rem',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        transition: 'var(--info-transition)'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = 'var(--info-secondary)'}
                                    onMouseOut={(e) => e.target.style.background = 'var(--info-accent)'}
                                    title="Actualizar datos"
                                >
                                    🔄 Actualizar
                                </button>
                            </div>
                            <div className="info-stat-value" style={{ fontSize: '1.5rem' }}>
                                {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                            </div>
                            <div className="info-stat-label">Fecha Actual</div>
                            <div className="info-stat-description">
                                {new Date().toLocaleDateString('es-ES', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </div>
                            {ultimaActualizacion && (
                                <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--info-text-muted)' }}>
                                    🕒 Actualizado: {ultimaActualizacion.toLocaleTimeString('es-ES', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sección de métricas adicionales */}
                    {metricas && (
                        <div className="info-date-section">
                            <div className="info-date-label">Métricas Adicionales</div>
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                gap: '1rem',
                                marginTop: '1rem'
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--info-primary)' }}>
                                        {metricas.promedioBolonesPerFamilia}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--info-text-light)' }}>
                                        Promedio bolsones/familia
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--info-success)' }}>
                                        {metricas.porcentajeFamiliasActivas}%
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--info-text-light)' }}>
                                        Familias activas
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--info-accent)' }}>
                                        {datosDetallados.length > 0 ? Math.max(...datosDetallados.map(p => p.bolsones || 0)) : 0}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--info-text-light)' }}>
                                        Máximo bolsones/familia
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Información de última actualización */}
                    {ultimaActualizacion && (
                        <div style={{ 
                            textAlign: 'center', 
                            marginTop: '1.5rem', 
                            padding: '1rem',
                            background: 'var(--info-bg-light)',
                            borderRadius: 'var(--info-radius-md)',
                            border: '1px solid var(--info-border)'
                        }}>
                            <div style={{ fontSize: '0.875rem', color: 'var(--info-text-muted)' }}>
                                📊 Datos actualizados el {formatearFecha(ultimaActualizacion)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InformacionBolsonesModerno;

