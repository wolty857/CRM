import React from 'react';
import './SalesPipeline.css';

const etapas = ['Prospecto', 'Contactado', 'Negociación', 'Cierre'];

function SalesPipeline() {
  return (
    <div className="component-card sales-pipeline">
      <h2>Pipeline de Ventas</h2>
      <div className="pipeline-stages">
        {etapas.map((etapa, index) => (
          <span key={index} className="stage">
            {etapa}
          </span>
        ))}
      </div>
    </div>
  );
}

export default SalesPipeline;
