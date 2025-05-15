import React, { useState } from 'react';
import './DataManagement.css';

function DataManagement() {
  const [datos, setDatos] = useState(['Cliente 1', 'Cliente 2']);
  const [nuevo, setNuevo] = useState('');

  const agregar = () => {
    if (nuevo) {
      setDatos([...datos, nuevo]);
      setNuevo('');
    }
  };

  const eliminar = (index) => {
    const copia = [...datos];
    copia.splice(index, 1);
    setDatos(copia);
  };

  return (
    <div className="component-card data-management">
      <h2>Gestión de Datos</h2>
      <input
        type="text"
        value={nuevo}
        placeholder="Nuevo dato..."
        onChange={(e) => setNuevo(e.target.value)}
      />
      <button onClick={agregar}>Agregar</button>
      <ul>
        {datos.map((d, i) => (
          <li key={i}>
            {d} <button onClick={() => eliminar(i)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataManagement;
