import React, { useState, useEffect } from 'react';
import './SalesPipeline.css';

// Los datos simulados para el pipeline han sido eliminados.
// La data vendrá de una fuente externa (ej. API / DB)

function SalesPipeline() {
  const [etapas, setEtapas] = useState([]); // Inicializar con array vacío
  
  // La lógica para cargar y actualizar etapas vendrá de una fuente externa.
  // Ejemplo de cómo podrías cargar datos (deberás adaptarlo):
  // useEffect(() => {
  //   fetch('/api/pipeline-stages') // Reemplaza con tu endpoint real
  //     .then(response => response.json())
  //     .then(data => setEtapas(data))
  //     .catch(error => console.error('Error fetching pipeline data:', error));
  // }, []);
  
  const formatNumber = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return '0'; // Manejar casos donde num no es un número o es NaN
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="component-card sales-pipeline">
      <h2>Pipeline de Ventas</h2>
      <div className="pipeline-stages">
        {etapas.length === 0 ? (
          <p>No hay datos de pipeline disponibles.</p> 
        ) : (
          etapas.map((etapa, index) => (
            <div key={index} className="pipeline-stage">
              <div className="stage-header">
                <div className="stage-title">
                  <span>{etapa.icono || '📊'}</span>
                  {etapa.nombre || 'Etapa Desconocida'}
                  <span className="stage-count">{etapa.cantidad !== undefined ? etapa.cantidad : 0}</span>
                </div>
                <div className="stage-value">${formatNumber(etapa.valor)}</div> {/* No es necesario || 0 si se asegura que valor es un número */}
              </div>
              <div className="stage-progress">
                <div 
                  className="progress-bar" 
                  style={{ width: `${etapa.porcentaje || 0}%` }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SalesPipeline;
