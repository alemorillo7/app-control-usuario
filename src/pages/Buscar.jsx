import React from 'react';
import Buscador from "../components/Buscador";

// Define un objeto de estilos para una mejor organización y para evitar conflictos de nombres de clases.
// Esto simula un enfoque de CSS-in-JS o módulos CSS sin necesidad de configuración adicional.
const buscarEstilos = {
  contenedorPrincipal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh', // Ocupa toda la altura de la ventana para centrar el contenido
    backgroundColor: '#f8f9fa', // Un fondo claro y moderno
    padding: '20px',
    fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif", // Fuente moderna y legible
    color: '#343a40', // Color de texto oscuro para contraste
  },
  tituloComponente: {
    fontSize: '2.8em', // Tamaño de fuente más grande para el título
    color: '#007bff', // Un color primario vibrante
    marginBottom: '40px', // Más espacio debajo del título
    textAlign: 'center',
    fontWeight: '700', // Negrita para el título
    textShadow: '1px 1px 3px rgba(0,0,0,0.1)', // Sombra sutil para profundidad
    letterSpacing: '1px', // Espaciado entre letras para un look moderno
  },
};

// Usamos React.memo para optimizar el rendimiento de este componente.
// Si las props de Buscar (que actualmente no tiene) no cambian, el componente no se re-renderizará.
// Esto es útil si este componente fuera a recibir props en el futuro.
const BuscarComponent = () => {
  return (
    <div style={buscarEstilos.contenedorPrincipal}> {/* Aplicamos los estilos directamente */} 
      <h1 style={buscarEstilos.tituloComponente}></h1>
      <Buscador />
    </div>
  );
};

BuscarComponent.displayName = "Buscar";

export const Buscar = React.memo(BuscarComponent);

// Notas sobre el rendimiento:
// 1. React.memo: Envuelve el componente para evitar re-renders innecesarios si sus props no cambian.
// 2. Optimización de Buscador: Asegúrate de que el componente `Buscador` interno también esté optimizado.
//    Si `Buscador` realiza operaciones costosas o tiene muchos re-renders, considera aplicar `React.memo` también a `Buscador`
//    o usar `useCallback`/`useMemo` para funciones/valores que se le pasen como props.
// 3. Carga de recursos: Si `Buscador` carga datos o recursos, implementa carga perezosa (lazy loading) si es posible.
