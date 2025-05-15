import React, { useState } from 'react';
import './CustomersLeads.css';
import { useClientes } from '../context/ClientesContext';

function CustomersLeads() {
  const { clientes, agregarCliente, borrarCliente, modificarCliente } = useClientes();

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('Nuevo Lead');

  const [editandoIndex, setEditandoIndex] = useState(null);

  const agregarOEditarLead = () => {
    if (!nuevoNombre) return;
    const cliente = { nombre: nuevoNombre, estado: nuevoEstado };

    if (editandoIndex !== null) {
      modificarCliente(editandoIndex, cliente);
      setEditandoIndex(null);
    } else {
      agregarCliente(cliente);
    }

    setNuevoNombre('');
    setNuevoEstado('Nuevo Lead');
  };

  const prepararEdicion = (cliente, index) => {
    setNuevoNombre(cliente.nombre);
    setNuevoEstado(cliente.estado);
    setEditandoIndex(index);
  };

  return (
    <div className="component-card customers-leads">
      <h2>Clientes y Leads</h2>

      <table className="leads-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente, i) => (
            <tr key={i}>
              <td>{cliente.nombre}</td>
              <td>{cliente.estado}</td>
              <td>
                <button onClick={() => prepararEdicion(cliente, i)}>✏️ Editar</button>
                <button onClick={() => borrarCliente(i)}>🗑️ Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-lead-form">
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
        />
        <select
          value={nuevoEstado}
          onChange={(e) => setNuevoEstado(e.target.value)}
        >
          <option>Nuevo Lead</option>
          <option>Cliente Activo</option>
          <option>Negociación</option>
          <option>Cliente Perdido</option>
        </select>
        <button onClick={agregarOEditarLead}>
          {editandoIndex !== null ? 'Guardar Cambios' : 'Agregar Cliente/Lead'}
        </button>
        {editandoIndex !== null && (
          <button
            onClick={() => {
              setNuevoNombre('');
              setNuevoEstado('Nuevo Lead');
              setEditandoIndex(null);
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

export default CustomersLeads;
