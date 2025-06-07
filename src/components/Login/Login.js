import React, { useState, useEffect } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Efecto para aplicar el modo oscuro al componente Login
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Función para alternar el modo oscuro
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');    try {
      const response = await fetch('http://localhost/dashboard/CRM%20Wolty/CRM/api/auth/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Guardar datos del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        // Llamar a la función onLogin del componente padre
        onLogin(data.user);
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de conexión. Inténtalo de nuevo.');
      console.error('Error de login:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={`login-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="login-card">
        <div className="login-header">
          <div className="header-top">
            <h2>Cordova IA</h2>            <button
              type="button"
              className="dark-mode-toggle"
              onClick={toggleDarkMode}
              aria-label="Alternar modo oscuro"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <p>Inicia sesión para continuar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Ingresa tu usuario"
              disabled={loading}
            />
          </div>
            <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
