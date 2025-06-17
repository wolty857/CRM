import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Obtenemos el elemento DOM donde montaremos nuestra aplicación
const container = document.getElementById('root');

// Creamos una raíz de React
const root = ReactDOM.createRoot(container);

// Renderizamos el componente principal App dentro de la raíz
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
