import React, { useState, useEffect, useRef } from 'react';
import './KPIsPanel.css';
import { getKPIs } from '../services/api';

function KPIsPanel({ currentUser }) {  const [data, setData] = useState({
    clientes: 0,
    ingresos: 0,
    conversion: 0,
    planes_activos: 0,
    usuarios_activos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Referencias para seguir los valores anteriores
  const prevData = useRef(data);
  const [animated, setAnimated] = useState({
    clientes: false,
    ingresos: false,
    conversion: false,
    planes_activos: false,
    usuarios_activos: false
  });
  // Cargar datos de KPIs desde la API
  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setLoading(true);
        const kpisData = await getKPIs(currentUser);
        
        setData({
          clientes: kpisData.kpis?.total_clientes || 0,
          ingresos: kpisData.kpis?.ingresos_estimados || 0,
          conversion: kpisData.kpis?.tasa_conversion || 0,
          planes_activos: kpisData.kpis?.planes_activos || 0,
          usuarios_activos: kpisData.kpis?.usuarios_activos || 0,
        });
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar KPIs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
      // Actualizar cada 30 segundos
    const interval = setInterval(fetchKPIs, 30000);
    return () => clearInterval(interval);
  }, [currentUser]); // Agregar currentUser como dependencia

  // ...existing code...
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
  };  return (
    <div className="component-card kpi-panel">
      <h2>
        {currentUser?.role === 'admin' ? 'Métricas del Sistema' : 'Mis Indicadores'}
      </h2>
      
      {loading ? (
        <div className="kpi-loading">
          <p>Cargando métricas...</p>
        </div>
      ) : error ? (
        <div className="kpi-error">
          <p>Error al cargar KPIs: {error}</p>
        </div>
      ) : (
        <div className="kpi-items">
          {/* KPIs para Admin */}
          {currentUser?.role === 'admin' ? (
            <>
              <div className="kpi-item">
                <span className={`kpi-value ${animated.clientes ? 'animate' : ''}`}>
                  {formatNumber(data.clientes)}
                </span>
                <span className="kpi-label">Total Clientes</span>
              </div>
              <div className="kpi-item">
                <span className={`kpi-value ${animated.usuarios_activos ? 'animate' : ''}`}>
                  {formatNumber(data.usuarios_activos)}
                </span>
                <span className="kpi-label">Usuarios Activos</span>
              </div>
              <div className="kpi-item">
                <span className={`kpi-value ${animated.planes_activos ? 'animate' : ''}`}>
                  {formatNumber(data.planes_activos)}
                </span>
                <span className="kpi-label">Planes Activos</span>
              </div>
              <div className="kpi-item">
                <span className={`kpi-value ${animated.ingresos ? 'animate' : ''}`}>
                  ${formatNumber(data.ingresos)}
                </span>
                <span className="kpi-label">Ingresos Estimados</span>
              </div>
            </>
          ) : (
            /* KPIs para Vendedor */
            <>
              <div className="kpi-item">
                <span className={`kpi-value ${animated.clientes ? 'animate' : ''}`}>
                  {formatNumber(data.clientes)}
                </span>
                <span className="kpi-label">Mis Clientes</span>
              </div>
              <div className="kpi-item">
                <span className={`kpi-value ${animated.ingresos ? 'animate' : ''}`}>
                  ${formatNumber(data.ingresos)}
                </span>
                <span className="kpi-label">Mis Ingresos</span>
              </div>
              <div className="kpi-item">
                <span className={`kpi-value ${animated.conversion ? 'animate' : ''}`}>
                  {data.conversion}%
                </span>
                <span className="kpi-label">Tasa de Conversión</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default KPIsPanel;
