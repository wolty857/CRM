import React, { useState, useEffect, useRef } from 'react';
import { getKPIs } from '../../services/api';
import './SalesKPIsPanel.css';
import { BsBullseye, BsPeople, BsFire, BsCurrencyDollar, BsGraphUp } from 'react-icons/bs';

function SalesKPIsPanel({ currentUser }) {
  const [data, setData] = useState({
    total_clientes: 0,
    clientes_calientes: 0,
    ingresos_estimados: 0,
    tasa_conversion: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Referencias para seguir los valores anteriores
  const prevData = useRef(data);
  const [animated, setAnimated] = useState({
    total_clientes: false,
    clientes_calientes: false,
    ingresos_estimados: false,
    tasa_conversion: false
  });

  // Cargar datos de KPIs desde la API
  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setLoading(true);
        const kpisData = await getKPIs(currentUser);
        
        setData({
          total_clientes: kpisData.kpis?.total_clientes || 0,
          clientes_calientes: kpisData.kpis?.clientes_calientes || 0,
          ingresos_estimados: kpisData.kpis?.ingresos_estimados || 0,
          tasa_conversion: kpisData.kpis?.tasa_conversion || 0,
        });
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar KPIs de Vendedor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchKPIs, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Detectar cambios para animaciones
  useEffect(() => {
    const animatedFields = {};
    
    if (prevData.current.total_clientes !== data.total_clientes) {
      animatedFields.total_clientes = true;
    }
    if (prevData.current.clientes_calientes !== data.clientes_calientes) {
      animatedFields.clientes_calientes = true;
    }
    if (prevData.current.ingresos_estimados !== data.ingresos_estimados) {
      animatedFields.ingresos_estimados = true;
    }
    if (prevData.current.tasa_conversion !== data.tasa_conversion) {
      animatedFields.tasa_conversion = true;
    }
    
    // Si hay cambios, activar animaciones
    if (Object.keys(animatedFields).length > 0) {
      setAnimated(animatedFields);
      
      // Guardar los nuevos valores como "anteriores" para la próxima comparación
      prevData.current = { ...data };
      
      // Desactivar las animaciones después de que se completen
      setTimeout(() => {
        setAnimated({
          total_clientes: false,
          clientes_calientes: false,
          ingresos_estimados: false,
          tasa_conversion: false
        });
      }, 600);
    }
  }, [data]);

  // Función para formatear números grandes con separadores de miles
  const formatNumber = (num) => {
    if (typeof num !== 'number') return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="component-card sales-kpi-panel">
      <h2><BsBullseye /> Mis Indicadores de Ventas</h2>
      
      {loading ? (
        <div className="kpi-loading">
          <p>Cargando mis métricas...</p>
        </div>
      ) : error ? (
        <div className="kpi-error">
          <p>Error al cargar KPIs: {error}</p>
        </div>
      ) : (
        <div className="sales-kpi-grid">
          <div className="sales-kpi-item">
            <div className="kpi-icon"><BsPeople /></div>
            <div className="kpi-content">
              <span className={`kpi-value ${animated.total_clientes ? 'animate' : ''}`}>
                {formatNumber(data.total_clientes)}
              </span>
              <span className="kpi-label">Mis Clientes</span>
            </div>
          </div>
          
          <div className="sales-kpi-item hot-leads">
            <div className="kpi-icon"><BsFire /></div>
            <div className="kpi-content">
              <span className={`kpi-value ${animated.clientes_calientes ? 'animate' : ''}`}>
                {formatNumber(data.clientes_calientes)}
              </span>
              <span className="kpi-label">Leads Calientes</span>
            </div>
          </div>
          
          <div className="sales-kpi-item">
            <div className="kpi-icon"><BsCurrencyDollar /></div>
            <div className="kpi-content">
              <span className={`kpi-value ${animated.ingresos_estimados ? 'animate' : ''}`}>
                ${formatNumber(data.ingresos_estimados)}
              </span>
              <span className="kpi-label">Mis Ingresos</span>
            </div>
          </div>
          
          <div className="sales-kpi-item conversion">
            <div className="kpi-icon"><BsGraphUp /></div>
            <div className="kpi-content">
              <span className={`kpi-value ${animated.tasa_conversion ? 'animate' : ''}`}>
                {data.tasa_conversion}%
              </span>
              <span className="kpi-label">Tasa de Conversión</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesKPIsPanel;
