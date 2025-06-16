import React, { useState, useEffect } from 'react';
import './App.css'; // Crearemos este archivo CSS más adelante

// Importar los componentes
import KPIsPanel from './components/KPIsPanel';
import VisualReports from './components/VisualReports';
import CustomersLeads from './components/CustomersLeads';
import AgendaActivities from './components/AgendaActivities';
import Login from './components/Login/Login'; // Importar el componente Login
import AgentesChat from './components/AgentesChat'; // Importar el componente de chat
import UsersManagement from './components/UsersManagement'; // Importar gestión de usuarios
import { ClientesProvider } from './context/ClientesContext';

function App() {  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);// Collapsed by default on mobile
  // const [selectedPlan, setSelectedPlan] = useState('básico'); // Eliminado
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  // Función para alternar la barra lateral
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  // Función para cambiar sección y cerrar sidebar en móvil
  const handleSectionChange = (section) => {
    if (section === activeSection) return; // No hacer nada si es la misma sección
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setActiveSection(section);
      setIsTransitioning(false);
      
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    }, 150); // Duración de la transición de salida
  };
  // Función para alternar el modo oscuro
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };  // Verificar autenticación al cargar la app
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Efecto para aplicar el modo oscuro al cargar y cuando cambie
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

  // Función para manejar el login exitoso
  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };
  // Si no está autenticado, mostrar el componente Login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }
  // Función para renderizar el contenido principal basado en la sección activa
  const renderMainContent = () => {
    switch(activeSection) {      case 'dashboard':
        return (
          <div className="dashboard-container">
            <KPIsPanel currentUser={currentUser} />
            <VisualReports />
          </div>
        );      case 'customers':
        return currentUser?.role === 'admin' ? 
          <UsersManagement searchQuery={searchQuery} isDarkMode={isDarkMode} /> : 
          <CustomersLeads searchQuery={searchQuery} currentUser={currentUser} />;
      case 'agenda':
        return <AgendaActivities />;
      case 'agentes':
        return <AgentesChat />; // Componente de chat
      default:
        return <div className="welcome-section">Selecciona una sección del menú lateral</div>;
    }
  };
  return (
    <ClientesProvider>
      <div className={`crm-app ${isDarkMode ? 'dark-mode' : ''}`}>
        {/* Overlay para móvil */}
        {!sidebarCollapsed && window.innerWidth < 768 && (
          <div className="sidebar-overlay" onClick={toggleSidebar}></div>
        )}
        
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
              placeholder="Buscar cliente..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          {/* Eliminado el selector de planes */}
            <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleSectionChange('dashboard')}
            >
              <span className="nav-icon">📊</span> Dashboard
            </button>            <button 
              className={`nav-item ${activeSection === 'customers' ? 'active' : ''}`}
              onClick={() => handleSectionChange('customers')}
            >
              <span className="nav-icon">
                {currentUser?.role === 'admin' ? '👥' : '🎯'}
              </span> 
              {currentUser?.role === 'admin' ? 'Usuarios del Sistema' : 'Mis Clientes y Leads'}
            </button>
            <button 
              className={`nav-item ${activeSection === 'agenda' ? 'active' : ''}`}
              onClick={() => handleSectionChange('agenda')}
            >
              <span className="nav-icon">📅</span> Agenda Google
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
        <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>          <header className="content-header">            <div className="header-left">
              <h1>{activeSection === 'dashboard' ? 'Panel de Control' : 
                  activeSection === 'customers' ? (currentUser?.role === 'admin' ? 'Usuarios del Sistema' : 'Mis Clientes y Leads') :
                  activeSection === 'agenda' ? 'Agenda Google Calendar' :
                  activeSection === 'agentes' ? 'Agentes Inteligentes' :
                  'Dashboard'}</h1>
            </div>
              <div className="header-right">
              <div className="user-info">
                <div className="user-details">
                  <span className="user-name">
                    👤 {currentUser?.nombre_completo || currentUser?.username || 'Usuario'}
                  </span>
                  <span className="user-role">
                    {currentUser?.role === 'admin' ? '🔐 Administrador' : '👨‍💼 Vendedor'}
                  </span>
                  <span className="user-plan">
                    💎 Plan {currentUser?.plan ? currentUser.plan.charAt(0).toUpperCase() + currentUser.plan.slice(1) : 'Básico'}
                  </span>
                </div><button className="logout-btn" onClick={handleLogout}>
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
    </ClientesProvider>
  );
}

export default App;
