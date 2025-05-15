import React from 'react';
import './App.css'; // Crearemos este archivo CSS más adelante

// Importar los nuevos componentes
import KPIsPanel from './components/KPIsPanel';
import VisualReports from './components/VisualReports';
import CustomersLeads from './components/CustomersLeads';
import AgendaActivities from './components/AgendaActivities';
import SalesPipeline from './components/SalesPipeline';
import Filters from './components/Filters';
import QuickAccess from './components/QuickAccess';
import DataManagement from './components/DataManagement'; // Importar el componente DataManagement
import { ClientesProvider } from './context/ClientesContext';

function App() {
  return (
    <ClientesProvider>
    <div className="App">
      <header className="App-header">
        <h1>CRM Dashboard Landing Page Cordova IA</h1>
        {/* Aquí podrías agregar navegación o elementos de encabezado */}
      </header>
      <main>
        {/* Renderizar los diferentes componentes del dashboard */}
        <QuickAccess /> {/* Accesos Rápidos */}
        <Filters /> {/* Filtros */}
        <KPIsPanel /> {/* Panel de KPIs */}
        <VisualReports /> {/* Gráficos e Informes */}
        <CustomersLeads /> {/* Gestión de Clientes y Leads */}
        <AgendaActivities /> {/* Agenda y Actividades */}
        <SalesPipeline /> {/* Pipeline de Ventas */}
        <DataManagement /> {/* Gestión de Datos (Agregar/Modificar/Borrar) */}
      </main>
      <footer>
        {/* Pie de página si es necesario */}
        <p>© 2023 CRM Dashboard</p>
      </footer>
    </div>
    </ClientesProvider>
  );
}

export default App;
