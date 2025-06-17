import React from 'react';
import './AdminReports.css';

function AdminReports() {
  return (
    <div className="admin-reports">
      <h3>📊 Reportes del Sistema</h3>
      <div className="reports-grid">
        <div className="report-card">
          <h4>📈 Rendimiento por Vendedor</h4>
          <p>Análisis de ventas por cada vendedor del equipo</p>
          <button className="report-btn">Ver Reporte</button>
        </div>
        
        <div className="report-card">
          <h4>📊 Análisis de Planes</h4>
          <p>Distribución y rendimiento de planes de suscripción</p>
          <button className="report-btn">Ver Reporte</button>
        </div>
        
        <div className="report-card">
          <h4>💰 Ingresos por Período</h4>
          <p>Evolución de ingresos mensuales y anuales</p>
          <button className="report-btn">Ver Reporte</button>
        </div>
        
        <div className="report-card">
          <h4>👥 Gestión de Usuarios</h4>
          <p>Estado y actividad de usuarios en el sistema</p>
          <button className="report-btn">Ver Reporte</button>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
