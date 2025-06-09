import React from 'react';
import './VisualReports.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function VisualReports({ data = [] }) {
  return (
    <div className="component-card visual-reports">
      <h2>Gráficos e Informes</h2>
      {data.length === 0 ? (
        <p>No hay datos disponibles para mostrar en el gráfico.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ventas" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default VisualReports;
