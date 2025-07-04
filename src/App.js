import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login/Login';
import AuthenticatedApp from './AuthenticatedApp';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Función para manejar el login exitoso
  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('google_access_token');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Si no está autenticado, mostrar el componente Login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Si está autenticado, mostrar la aplicación correspondiente
  return (
    <AuthenticatedApp 
      currentUser={currentUser}
      onLogout={handleLogout}
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
    />
  );
}

export default App;
