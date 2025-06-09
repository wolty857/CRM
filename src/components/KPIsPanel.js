import React, { useState, useEffect, useRef } from 'react';
import './KPIsPanel.css';

function KPIsPanel() {
  const [data, setData] = useState({
    clientes: 0,
    ingresos: 0,
    conversion: 0,
  });
  
  // Referencias para seguir los valores anteriores
  const prevData = useRef(data);
  const [animated, setAnimated] = useState({
    clientes: false,
    ingresos: false,
    conversion: false
  });

  // Efecto para detectar cambios y activar animaciones
  useEffect(() => {
    const animatedFields = {};
    
    if (prevData.current.clientes !== data.clientes) {
      animatedFields.clientes = true;
    }
    
    if (prevData.current.ingresos !== data.ingresos) {
      animatedFields.ingresos = true;
    }
    
    if (prevData.current.conversion !== data.conversion) {
      animatedFields.conversion = true;
    }
    
    // Si hay cambios, activar animaciones
    if (Object.keys(animatedFields).length > 0) {
      setAnimated(animatedFields);
      
      // Guardar los nuevos valores como "anteriores" para la próxima comparación
      prevData.current = { ...data };
      
      // Desactivar las animaciones después de que se completen
      setTimeout(() => {
        setAnimated({
          clientes: false,
          ingresos: false,
          conversion: false
        });
      }, 600);
    }
  }, [data]);

  // Función para formatear números grandes con separadores de miles
  const formatNumber = (num) => {
    if (typeof num !== 'number') return '0'; // Manejar casos donde num no es un número
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="component-card kpi-panel">
      <h2>Indicadores Clave (KPIs)</h2>
      { (data.clientes === 0 && data.ingresos === 0 && data.conversion === 0) ? (
        <p>No hay KPIs disponibles.</p>
      ) : (
        <div className="kpi-items">
          <div className="kpi-item">
            <span className={`kpi-value ${animated.clientes ? 'animate' : ''}`}>
              {formatNumber(data.clientes)}
            </span>
            <span className="kpi-label">Nuevos Clientes</span>
          </div>
          <div className="kpi-item">
            <span className={`kpi-value ${animated.ingresos ? 'animate' : ''}`}>
              ${formatNumber(data.ingresos)}
            </span>
            <span className="kpi-label">Ingresos</span>
          </div>
          <div className="kpi-item">
            <span className={`kpi-value ${animated.conversion ? 'animate' : ''}`}>
              {data.conversion}%
            </span>
            <span className="kpi-label">Tasa de Conversión</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default KPIsPanel;
