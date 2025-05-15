import React from 'react';
import './VisualReports.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { mes: 'Ene', ventas: 4000 },
  { mes: 'Feb', ventas: 3000 },
  { mes: 'Mar', ventas: 5000 },
  { mes: 'Abr', ventas: 2500 },
  { mes: 'May', ventas: 4800 },
];

function VisualReports() {
  return (
    <div className="component-card visual-reports">
      <h2>Gráficos e Informes</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="ventas" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VisualReports;
