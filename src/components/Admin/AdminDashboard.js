import React from 'react';
import AdminKPIsPanel from './AdminKPIsPanel';
import UsersManagement from '../UsersManagement';
import AdminReports from './AdminReports';
import './AdminDashboard.css';

function AdminDashboard({ activeSection, searchQuery, isDarkMode, currentUser }) {
  const renderAdminContent = () => {
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
      default:
        return <div className="welcome-section">Panel de Administración</div>;
    }
  };

  return (
    <div className={`admin-dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
      {renderAdminContent()}
    </div>
  );
}

export default AdminDashboard;
