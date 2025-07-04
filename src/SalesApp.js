import React, { useState, useEffect } from 'react';
import SalesKPIsPanel from './components/Sales/SalesKPIsPanel';
import CustomersLeads from './components/CustomersLeads';
import SalesReports from './components/Sales/SalesReports';
import AgendaActivities from './components/AgendaActivities';
import AgentesChat from './components/AgentesChat';
import { ClientesProvider } from './context/ClientesContext';
import './App.css';
import { BsBarChartLine, BsBullseye, BsCalendarEvent, BsGraphUp, BsRobot, BsPersonCircle, BsPersonBadge, BsGem, BsSunFill, BsMoonFill } from 'react-icons/bs';

function SalesApp({ currentUser, onLogout, isDarkMode, setIsDarkMode }) {
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
          <div className="sales-dashboard-container">
            <SalesKPIsPanel currentUser={currentUser} />
            <SalesReports currentUser={currentUser} />
          </div>
        );
      case 'my-leads':
        return <CustomersLeads searchQuery={searchQuery} currentUser={currentUser} />;
      case 'my-agenda':
        return <AgendaActivities currentUser={currentUser} />;
      case 'my-reports':
        return <SalesReports currentUser={currentUser} />;
      case 'agentes':
        return <AgentesChat />;
      default:
        return <div className="welcome-section">Panel de Ventas</div>;
    }
  };

  // Función para obtener el título de la sección
  const getSectionTitle = () => {
    switch(activeSection) {
      case 'dashboard': return 'Panel de Ventas';
      case 'my-leads': return 'Mis Leads';
      case 'my-agenda': return 'Mi Agenda';
      case 'my-reports': return 'Mis Reportes';
      case 'agentes': return 'Agentes IA';
      default: return 'Panel de Ventas';
    }
  };

  return (
    <ClientesProvider>
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
              placeholder="Buscar cliente..." 
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
              <span className="nav-icon"><BsBarChartLine /></span> Dashboard
            </button>
            
            <button 
              className={`nav-item ${activeSection === 'my-leads' ? 'active' : ''}`}
              onClick={() => handleSectionChange('my-leads')}
            >
              <span className="nav-icon"><BsBullseye /></span> Mis Leads
            </button>
            
            <button 
              className={`nav-item ${activeSection === 'my-agenda' ? 'active' : ''}`}
              onClick={() => handleSectionChange('my-agenda')}
            >
              <span className="nav-icon"><BsCalendarEvent /></span> Mi Agenda
            </button>
            
            <button 
              className={`nav-item ${activeSection === 'my-reports' ? 'active' : ''}`}
              onClick={() => handleSectionChange('my-reports')}
            >
              <span className="nav-icon"><BsGraphUp /></span> Mis Reportes
            </button>
            
            <button 
              className={`nav-item ${activeSection === 'agentes' ? 'active' : ''}`}
              onClick={() => handleSectionChange('agentes')}
            >
              <span className="nav-icon"><BsRobot /></span> Agentes IA
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
                    <BsPersonCircle /> {currentUser?.nombre_completo || currentUser?.username || 'Vendedor'}
                  </span>
                  <span className="user-role">
                    <BsPersonBadge /> Vendedor
                  </span>
                  <span className="user-plan">
                    <BsGem /> Plan {currentUser?.plan ? currentUser.plan.charAt(0).toUpperCase() + currentUser.plan.slice(1) : 'Básico'}
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
          {isDarkMode ? <BsSunFill /> : <BsMoonFill />}
        </button>
      </div>
    </ClientesProvider>
  );
}

export default SalesApp;
