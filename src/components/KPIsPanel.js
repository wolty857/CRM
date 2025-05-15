import React, { useState, useEffect } from 'react';
import './KPIsPanel.css';

function KPIsPanel() {
  const [data, setData] = useState({
    clientes: 120,
    ingresos: 45000,
    conversion: 78,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        clientes: 100 + Math.floor(Math.random() * 50),
        ingresos: 40000 + Math.floor(Math.random() * 10000),
        conversion: 70 + Math.floor(Math.random() * 10),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="component-card kpi-panel">
      <h2>Indicadores Clave (KPIs)</h2>
      <div className="kpi-items">
        <div className="kpi-item">
          <span className="kpi-value">{data.clientes}</span>
          <span className="kpi-label">Nuevos Clientes</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-value">${data.ingresos}</span>
          <span className="kpi-label">Ingresos</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-value">{data.conversion}%</span>
          <span className="kpi-label">Conversión</span>
        </div>
      </div>
    </div>
  );
}

export default KPIsPanel;
