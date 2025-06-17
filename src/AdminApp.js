import React, { useState, useEffect } from 'react';
import AdminKPIsPanel from './components/Admin/AdminKPIsPanel';
import UsersManagement from './components/UsersManagement';
import AdminReports from './components/Admin/AdminReports';
import AgentesChat from './components/AgentesChat';
import './App.css';

function AdminApp({ currentUser, onLogout, isDarkMode, setIsDarkMode }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);

  // Función para alternar la barra lateral
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Función para cambiar sección con transición
  const handleSectionChange = (section) => {
    if (section === activeSection) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setActiveSection(section);
      setIsTransitioning(false);
      
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    }, 150);
  };

  // Función para alternar el modo oscuro
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  // Efecto para aplicar el modo oscuro
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Efecto para manejar el resize de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para renderizar el contenido principal
  const renderMainContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return (
          <div className="admin-dashboard-container">
            <AdminKPIsPanel currentUser={currentUser} />
            <AdminReports />
          </div>
        );
      case 'users-management':
        return <UsersManagement searchQuery={searchQuery} isDarkMode={isDarkMode} />;
      case 'system-reports':
        return <AdminReports />;
      case 'system-settings':
        return <div className="system-settings">Configuración del Sistema</div>;
      case 'agentes':
        return <AgentesChat />;
      default:
        return <div className="welcome-section">Panel de Administración</div>;
    }
  };

  // Función para obtener el título de la sección
  const getSectionTitle = () => {
    switch(activeSection) {
      case 'dashboard': return 'Panel de Administración';
      case 'users-management': return 'Gestión de Usuarios';
      case 'system-reports': return 'Reportes del Sistema';
      case 'system-settings': return 'Configuración del Sistema';
      case 'agentes': return 'Agentes IA';
      default: return 'Panel de Administración';
    }
  };

  return (
    <div className={`crm-app ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Overlay para móvil */}
      {!sidebarCollapsed && window.innerWidth < 768 && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Botón hamburguesa */}
      <button className={`sidebar-toggle ${!sidebarCollapsed ? 'open' : ''}`} onClick={toggleSidebar}>
        <span className="hamburger-icon"></span>
      </button>
      
      {/* Sidebar deslizable */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>Cordova IA</h2>
        </div>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Buscar usuario..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleSectionChange('dashboard')}
          >
            <span className="nav-icon">📊</span> Dashboard
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'users-management' ? 'active' : ''}`}
            onClick={() => handleSectionChange('users-management')}
          >
            <span className="nav-icon">👥</span> Gestión de Usuarios
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'system-reports' ? 'active' : ''}`}
            onClick={() => handleSectionChange('system-reports')}
          >
            <span className="nav-icon">📈</span> Reportes del Sistema
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'system-settings' ? 'active' : ''}`}
            onClick={() => handleSectionChange('system-settings')}
          >
            <span className="nav-icon">⚙️</span> Configuración
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'agentes' ? 'active' : ''}`}
            onClick={() => handleSectionChange('agentes')}
          >
            <span className="nav-icon">🤖</span> Agentes IA
          </button>
        </nav>
      </aside>
      
      {/* Área principal de contenido */}
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <header className="content-header">
          <div className="header-left">
            <h1>{getSectionTitle()}</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-details">
                <span className="user-name">
                  👤 {currentUser?.nombre_completo || currentUser?.username || 'Administrador'}
                </span>
                <span className="user-role">
                  🔐 Administrador
                </span>
                <span className="user-plan">
                  💎 Plan {currentUser?.plan ? currentUser.plan.charAt(0).toUpperCase() + currentUser.plan.slice(1) : 'Básico'}
                </span>
              </div>
              <button className="logout-btn" onClick={onLogout}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>
        
        <div className={`content-body ${isTransitioning ? 'transitioning' : ''}`}>
          {renderMainContent()}
        </div>
        
        <footer className="content-footer">
          <p>© {new Date().getFullYear()} Cordova IA - Inteligencia Artificial para tu Negocio</p>
        </footer>
      </main>

      {/* Botón para cambiar modo oscuro */}
      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}

export default AdminApp;
