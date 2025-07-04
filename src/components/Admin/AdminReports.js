import React from 'react';
import './AdminReports.css';
import { BsBarChartLine, BsGraphUp, BsCurrencyDollar, BsPeople, BsGraphUpArrow } from 'react-icons/bs';

function AdminReports() {
  return (
    <div className="admin-reports">
      <h3><BsBarChartLine /> Reportes del Sistema</h3>
      <div className="reports-grid">
        <div className="report-card">
          <h4><BsGraphUp /> Rendimiento por Vendedor</h4>
          <p>Análisis de ventas por cada vendedor del equipo</p>
          <button className="report-btn">Ver Reporte</button>
        </div>
        
        <div className="report-card">
          <h4><BsBarChartLine /> Análisis de Planes</h4>
          <p>Distribución y rendimiento de planes de suscripción</p>
          <button className="report-btn">Ver Reporte</button>
        </div>
        
        <div className="report-card">
          <h4><BsCurrencyDollar /> Ingresos por Período</h4>
          <p>Evolución de ingresos mensuales y anuales</p>
          <button className="report-btn">Ver Reporte</button>
        </div>
        
        <div className="report-card">
          <h4><BsPeople /> Gestión de Usuarios</h4>
          <p>Estado y actividad de usuarios en el sistema</p>
          <button className="report-btn">Ver Reporte</button>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
