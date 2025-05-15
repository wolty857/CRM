import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Descomentamos la importación de App

// Obtenemos el elemento DOM donde montaremos nuestra aplicación
const container = document.getElementById('root');

// Creamos una raíz de React
const root = ReactDOM.createRoot(container);

// Renderizamos el componente principal App dentro de la raíz
root.render(
  <React.StrictMode>
    <App /> {/* Descomentamos la renderización de App */}
    {/* <p>¡Hola, React está funcionando!</p> */} {/* Comentamos el párrafo simple */}
  </React.StrictMode>
);
