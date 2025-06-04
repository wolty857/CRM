import React, { useState, useEffect } from 'react';
import './App.css'; // Crearemos este archivo CSS más adelante

// Importar los componentes
import KPIsPanel from './components/KPIsPanel';
import VisualReports from './components/VisualReports';
import CustomersLeads from './components/CustomersLeads';
import AgendaActivities from './components/AgendaActivities';
import SalesPipeline from './components/SalesPipeline';
import DataManagement from './components/DataManagement'; // Importar el componente DataManagement
import Login from './components/Login/Login'; // Importar el componente Login
import { ClientesProvider } from './context/ClientesContext';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768); // Collapsed by default on mobile
  // const [selectedPlan, setSelectedPlan] = useState('básico'); // Eliminado
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Función para alternar la barra lateral
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  // Función para alternar el modo oscuro
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };
  // Verificar autenticación al cargar la app
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Efecto para aplicar la clase dark-mode al body y sidebar state en resize
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
    switch(activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-container">
            <KPIsPanel />
            <VisualReports />
          </div>
        );
      case 'customers':
        return <CustomersLeads searchQuery={searchQuery} />;
      case 'sales':
        return <SalesPipeline />;
      case 'agenda':
        return <AgendaActivities />;
      case 'data':
        return <DataManagement />;
      case 'agentes':
        return <AgentesIA />; // Eliminado prop plan
      default:
        return <div className="welcome-section">Selecciona una sección del menú lateral</div>;
    }
  };

  // Componente para mostrar los agentes de IA
  const AgentesIA = () => { // Eliminado prop plan
    return (
      <div className="component-card agentes-ia">
        <h2>Agentes Inteligentes</h2>
        
        {/* <div className="plan-badge"> // Eliminado plan badge
          <span>Plan {plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
        </div> */}
        
        <div className="agentes-container">
          <div className="agente-card">
            <div className="agente-icon">
              <span className="agente-status active"></span>
              <span className="icon">👨‍💼</span>
            </div>
            <div className="agente-info">
              <h3>1. Agente Vendedor 24/7</h3>
              <p className="agente-description">Atiende por WhatsApp o llamada, responde preguntas, guía al cliente y lo lleva a tomar acción.</p>
              <div className="agente-role">
                <strong>Funciona como:</strong> el primer asesor comercial del negocio.
              </div>
              <div className="agente-plan">Incluido en Plan Básico</div>
            </div>
          </div>
          
          <div className="agente-card">
            <div className="agente-icon">
              <span className="agente-status active"></span>
              <span className="icon">📅</span>
            </div>
            <div className="agente-info">
              <h3>2. Agente de Agenda Seguimiento</h3>
              <p className="agente-description">Agenda citas, envía recordatorios y confirma asistencias.</p>
              <div className="agente-role">
                <strong>Funciona como:</strong> una secretaria automatizada que nunca olvida.
              </div>
              <div className="agente-plan">Incluido en Plan Básico</div>
            </div>
          </div>
          
          <div className="agente-card">
            <div className="agente-icon">
              <span className="agente-status active"></span>
              <span className="icon">🔍</span>
            </div>
            <div className="agente-info">
              <h3>3. Agente Supervisor</h3>
              <p className="agente-description">Muestra al dueño del negocio cuántos clientes llegaron, se atendieron o se perdieron.</p>
              <div className="agente-role">
                <strong>Funciona como:</strong> el "Waze" de las ventas. Mide y guía.
              </div>
              <div className="agente-plan">Incluido en Plan Básico</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ClientesProvider>
      <div className={`crm-app ${isDarkMode ? 'dark-mode' : ''}`}>
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
              onClick={() => setActiveSection('dashboard')}
            >
              <span className="nav-icon">📊</span> Dashboard
            </button>
            <button 
              className={`nav-item ${activeSection === 'customers' ? 'active' : ''}`}
              onClick={() => setActiveSection('customers')}
            >
              <span className="nav-icon">👥</span> Clientes y Leads
            </button>
            <button 
              className={`nav-item ${activeSection === 'sales' ? 'active' : ''}`}
              onClick={() => setActiveSection('sales')}
            >
              <span className="nav-icon">📈</span> Pipeline de Ventas
            </button>
            <button 
              className={`nav-item ${activeSection === 'agenda' ? 'active' : ''}`}
              onClick={() => setActiveSection('agenda')}
            >
              <span className="nav-icon">📅</span> Agenda y Actividades
            </button>
            <button 
              className={`nav-item ${activeSection === 'data' ? 'active' : ''}`}
              onClick={() => setActiveSection('data')}
            >
              <span className="nav-icon">⚙️</span> Gestión de Datos
            </button>
            <button 
              className={`nav-item ${activeSection === 'agentes' ? 'active' : ''}`}
              onClick={() => setActiveSection('agentes')}
            >
              <span className="nav-icon">🤖</span> Agentes IA
            </button>
          </nav>
        </aside>
        
        {/* Área principal de contenido */}
        <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>          <header className="content-header">
            <div className="header-left">
              <h1>{activeSection === 'dashboard' ? 'Panel de Control' : 
                  activeSection === 'customers' ? 'Clientes y Leads' :
                  activeSection === 'sales' ? 'Pipeline de Ventas' :
                  activeSection === 'agenda' ? 'Agenda y Actividades' :
                  activeSection === 'agentes' ? 'Agentes Inteligentes' :
                  'Gestión de Datos'}</h1>
            </div>
            
            <div className="header-right">
              <div className="user-info">
                <div className="user-details">
                  <span className="user-name">
                    👤 {currentUser?.nombre_completo || currentUser?.username || 'Usuario'}
                  </span>
                  <span className="user-plan">
                    💎 Plan {currentUser?.plan ? currentUser.plan.charAt(0).toUpperCase() + currentUser.plan.slice(1) : 'Básico'}
                  </span>
                </div>                <button className="logout-btn" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
              
              <div className="quick-actions">
                {activeSection === 'customers' && (
                  <button className="action-button">
                    <span className="action-icon">+</span> Nuevo Cliente
                  </button>
                )}
                {activeSection === 'agenda' && (
                  <button className="action-button">
                    <span className="action-icon">+</span> Nueva Tarea
                  </button>
                )}
                {activeSection === 'sales' && (
                  <button className="action-button">
                    <span className="action-icon">+</span> Nueva Oportunidad
                  </button>
                )}
              </div>
            </div>
          </header>
          
          <div className="content-body">
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
