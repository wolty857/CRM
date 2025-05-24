import React, { useState, useEffect } from 'react';
import './SalesPipeline.css';

// Datos simulados para el pipeline
const etapasData = [
  { 
    nombre: 'Prospecto', 
    icono: '🔍', 
    cantidad: 32, 
    valor: 48000,
    porcentaje: 85 
  },
  { 
    nombre: 'Contactado', 
    icono: '📞', 
    cantidad: 24, 
    valor: 36000,
    porcentaje: 65 
  },
  { 
    nombre: 'Negociación', 
    icono: '📝', 
    cantidad: 12, 
    valor: 18000,
    porcentaje: 40 
  },
  { 
    nombre: 'Cierre', 
    icono: '🏆', 
    cantidad: 8, 
    valor: 12000,
    porcentaje: 25 
  }
];

function SalesPipeline() {
  const [etapas, setEtapas] = useState(etapasData);
  
  // Simulamos cambios aleatorios en los datos para demostración
  useEffect(() => {
    const interval = setInterval(() => {
      const nuevasEtapas = etapas.map(etapa => ({
        ...etapa,
        cantidad: Math.max(5, etapa.cantidad + Math.floor(Math.random() * 5) - 2),
        valor: Math.max(6000, etapa.valor + Math.floor(Math.random() * 2000) - 1000),
        porcentaje: Math.max(10, Math.min(95, etapa.porcentaje + Math.floor(Math.random() * 10) - 5))
      }));
      
      setEtapas(nuevasEtapas);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [etapas]);
  
  // Función para formatear números con separadores de miles
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="component-card sales-pipeline">
      <h2>Pipeline de Ventas</h2>
      <div className="pipeline-stages">
        {etapas.map((etapa, index) => (
          <div key={index} className="pipeline-stage">
            <div className="stage-header">
              <div className="stage-title">
                <span>{etapa.icono}</span>
                {etapa.nombre}
                <span className="stage-count">{etapa.cantidad}</span>
              </div>
              <div className="stage-value">${formatNumber(etapa.valor)}</div>
            </div>
            <div className="stage-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${etapa.porcentaje}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalesPipeline;
