import React, { useState } from 'react';
import './AgendaActivities.css';

function AgendaActivities() {
  const [actividades, setActividades] = useState([
    { titulo: 'Llamar a cliente', fecha: '2025-05-05', hora: '10:00' },
    { titulo: 'Reunión interna', fecha: '2025-05-05', hora: '12:00' },
  ]);

  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  const agregarActividad = () => {
    if (titulo && fecha && hora) {
      const nueva = { titulo, fecha, hora };
      setActividades([...actividades, nueva]);
      setTitulo('');
      setFecha('');
      setHora('');
    }
  };

  return (
    <div className="component-card agenda-activities">
      <h2>Agenda</h2>
      <ul className="agenda-list">
        {actividades.map((act, i) => (
          <li key={i}>
            📌 <strong>{act.titulo}</strong> <br />
            🗓 {act.fecha} 🕒 {act.hora}
          </li>
        ))}
      </ul>
      <div className="agenda-form">
        <input
          type="text"
          placeholder="Título de la actividad"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
        />
        <button onClick={agregarActividad}>Agregar</button>
      </div>
    </div>
  );
}

export default AgendaActivities;
