import React from 'react';
import './SalesReports.css';
import { BsGraphUp, BsBullseye, BsCalendar, BsCurrencyDollar, BsFire } from 'react-icons/bs';

function SalesReports({ currentUser }) {
  return (
    <div className="sales-reports">
      <h3><BsGraphUp /> Mis Reportes de Ventas</h3>
      <div className="reports-grid">
        <div className="report-card">
          <h4><BsBullseye /> Mi Funnel de Ventas</h4>
          <p>Estado de mis leads y proceso de conversión</p>
          <button className="report-btn">Ver Mi Funnel</button>
        </div>
        
        <div className="report-card">
          <h4><BsCalendar /> Actividad Mensual</h4>
          <p>Resumen de mi actividad y rendimiento del mes</p>
          <button className="report-btn">Ver Actividad</button>
        </div>
        
        <div className="report-card">
          <h4><BsCurrencyDollar /> Mis Comisiones</h4>
          <p>Cálculo de comisiones y bonificaciones</p>
          <button className="report-btn">Ver Comisiones</button>
        </div>
        
        <div className="report-card">
          <h4><BsFire /> Leads Calientes</h4>
          <p>Oportunidades prioritarias para seguimiento</p>
          <button className="report-btn">Ver Oportunidades</button>
        </div>
      </div>
    </div>
  );
}

export default SalesReports;
