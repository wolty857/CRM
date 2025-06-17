import React from 'react';
import AdminApp from './AdminApp';
import SalesApp from './SalesApp';

function AuthenticatedApp({ currentUser, onLogout, isDarkMode, setIsDarkMode }) {
  // Decidir qué aplicación mostrar basado en el rol del usuario
  if (currentUser?.role === 'admin') {
    return (
      <AdminApp 
        currentUser={currentUser}
        onLogout={onLogout}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    );
  } else {
    return (
      <SalesApp 
        currentUser={currentUser}
        onLogout={onLogout}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    );
  }
}

export default AuthenticatedApp;
