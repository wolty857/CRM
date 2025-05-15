import React from 'react';
import './QuickAccess.css';

function QuickAccess() {
  return (
    <div className="component-card quick-access">
      <h2>Accesos Rápidos</h2>
      <div className="quick-buttons">
        <button className="quick-btn">Nuevo Cliente</button>
        <button className="quick-btn">Nueva Tarea</button>
        <button className="quick-btn">Reporte Diario</button>
      </div>
    </div>
  );
}

export default QuickAccess;
