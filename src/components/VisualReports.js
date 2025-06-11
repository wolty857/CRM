import React, { useState, useEffect } from 'react';
import './VisualReports.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getKPIs } from '../services/api';

function VisualReports() {
  const [chartData, setChartData] = useState({
    estados: [],
    planes: [],
    metricas: {}
  });
  const [loading, setLoading] = useState(true);
  // Colores para los gráficos
  const estadosColors = {
    'Frío': '#3b82f6',      // Azul (info)
    'Tibio': '#f59e0b',     // Naranja (warning)  
    'Caliente': '#ef4444',  // Rojo (danger)
    'Cliente Perdido': '#10b981'  // Verde (success)
  };

  const planesColors = {
    'Plan Básico': '#8b5cf6',   // Morado
    'Plan Pro': '#10b981',      // Verde
    'Plan Premium': '#f59e0b'   // Dorado
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getKPIs();
        
        // Formatear datos para gráficos
        const estadosChart = data.estados?.map(item => ({
          name: item.tipo_estado,
          value: parseInt(item.cantidad),
          color: estadosColors[item.tipo_estado] || '#6b7280'
        })) || [];

        const planesChart = data.planes?.map(item => ({
          name: item.Tipo_plan.replace('Plan ', ''),
          value: parseInt(item.cantidad),
          color: planesColors[item.Tipo_plan] || '#6b7280'
        })) || [];

        setChartData({
          estados: estadosChart,
          planes: planesChart,
          metricas: data.metricas_detalladas || {}
        });
      } catch (error) {
        console.error('Error al cargar datos de gráficos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="component-card visual-reports">
        <h2>Gráficos e Informes</h2>
        <p>Cargando gráficos...</p>
      </div>
    );
  }

  return (
    <div className="component-card visual-reports">
      <h2>Gráficos e Informes</h2>
      
      <div className="charts-container">
        {/* Gráfico de Estados */}
        <div className="chart-section">
          <h3>Distribución por Estados</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.estados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {chartData.estados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Planes */}
        <div className="chart-section">
          <h3>Distribución por Planes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData.planes}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {chartData.planes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default VisualReports;
