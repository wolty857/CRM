import React from 'react';
import SalesKPIsPanel from './SalesKPIsPanel';
import CustomersLeads from '../CustomersLeads';
import SalesReports from './SalesReports';
import AgendaActivities from '../AgendaActivities';
import './SalesDashboard.css';

function SalesDashboard({ activeSection, searchQuery, isDarkMode, currentUser }) {
  const renderSalesContent = () => {
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
      default:
        return <div className="welcome-section">Panel de Ventas</div>;
    }
  };

  return (
    <div className={`sales-dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
      {renderSalesContent()}
    </div>
  );
}

export default SalesDashboard;
