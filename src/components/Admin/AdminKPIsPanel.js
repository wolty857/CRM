import React, { useState, useEffect, useRef } from 'react';
import { getKPIs } from '../../services/api';
import './AdminKPIsPanel.css';
import { BsBarChartLine, BsPeople, BsPersonBadgeFill, BsBriefcaseFill, BsCurrencyDollar } from 'react-icons/bs';

function AdminKPIsPanel({ currentUser }) {
  const [data, setData] = useState({
    total_clientes: 0,
    usuarios_activos: 0,
    planes_activos: 0,
    ingresos_estimados: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Referencias para seguir los valores anteriores
  const prevData = useRef(data);
  const [animated, setAnimated] = useState({
    total_clientes: false,
    usuarios_activos: false,
    planes_activos: false,
    ingresos_estimados: false
  });

  // Cargar datos de KPIs desde la API
  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setLoading(true);
        const kpisData = await getKPIs(currentUser);
        
        setData({
          total_clientes: kpisData.kpis?.total_clientes || 0,
          usuarios_activos: kpisData.kpis?.usuarios_activos || 0,
          planes_activos: kpisData.kpis?.planes_activos || 0,
          ingresos_estimados: kpisData.kpis?.ingresos_estimados || 0,
        });
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar KPIs de Admin:', err);
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
    if (prevData.current.usuarios_activos !== data.usuarios_activos) {
      animatedFields.usuarios_activos = true;
    }
    if (prevData.current.planes_activos !== data.planes_activos) {
      animatedFields.planes_activos = true;
    }
    if (prevData.current.ingresos_estimados !== data.ingresos_estimados) {
      animatedFields.ingresos_estimados = true;
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
          usuarios_activos: false,
          planes_activos: false,
          ingresos_estimados: false
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
    <div className="component-card admin-kpi-panel">
      <h2><BsBarChartLine /> Métricas del Sistema</h2>
      
      {loading ? (
        <div className="kpi-loading">
          <p>Cargando métricas del sistema...</p>
        </div>
      ) : error ? (
        <div className="kpi-error">
          <p>Error al cargar KPIs: {error}</p>
        </div>
      ) : (
        <div className="admin-kpi-grid">
          <div className="admin-kpi-item">
            <div className="kpi-icon"><BsPeople /></div>
            <div className="kpi-content">
              <span className={`kpi-value ${animated.total_clientes ? 'animate' : ''}`}>
                {formatNumber(data.total_clientes)}
              </span>
              <span className="kpi-label">Total Clientes</span>
            </div>
          </div>
          
          <div className="admin-kpi-item">
            <div className="kpi-icon"><BsPersonBadgeFill /></div>
            <div className="kpi-content">
              <span className={`kpi-value ${animated.usuarios_activos ? 'animate' : ''}`}>
                {formatNumber(data.usuarios_activos)}
              </span>
              <span className="kpi-label">Vendedores Activos</span>
            </div>
          </div>
          
          <div className="admin-kpi-item">
            <div className="kpi-icon"><BsBriefcaseFill /></div>
            <div className="kpi-content">
              <span className={`kpi-value ${animated.planes_activos ? 'animate' : ''}`}>
                {formatNumber(data.planes_activos)}
              </span>
              <span className="kpi-label">Planes Activos</span>
            </div>
          </div>
          
          <div className="admin-kpi-item">
            <div className="kpi-icon"><BsCurrencyDollar /></div>
            <div className="kpi-content">
              <span className={`kpi-value ${animated.ingresos_estimados ? 'animate' : ''}`}>
                ${formatNumber(data.ingresos_estimados)}
              </span>
              <span className="kpi-label">Ingresos Mensuales</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminKPIsPanel;
