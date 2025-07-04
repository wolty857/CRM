import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Obtenemos el elemento DOM donde montaremos nuestra aplicación
const container = document.getElementById('root');

// Creamos una raíz de React
const root = ReactDOM.createRoot(container);

// Renderizamos el componente principal App dentro de la raíz
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="131812555709-8nhk974ubndj02ic3n749i28pahcf6eb.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
