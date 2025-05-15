import React, { useState } from 'react';
import './Filters.css';
import { useClientes } from '../context/ClientesContext';

function Filters() {
  const { clientes } = useClientes();
  const [busqueda, setBusqueda] = useState('');

  const nombres = clientes.map(c => c.nombre);
  const filtrados = nombres.filter(c => c.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="component-card filters">
      <h2>Filtros</h2>
      <input
        type="text"
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <ul>
        {filtrados.map((c, i) => <li key={i}>{c}</li>)}
      </ul>
    </div>
  );
}

export default Filters;
