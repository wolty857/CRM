import React, { useState, useEffect } from 'react';
import './CustomersLeads.css';
import { useClientes } from '../context/ClientesContext';

function CustomersLeads({ searchQuery }) {
  const { clientes, agregarCliente, borrarCliente, modificarCliente } = useClientes();

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('Nuevo Lead');
  const [nuevoPlan, setNuevoPlan] = useState('básico');
  const [clientesFiltrados, setClientesFiltrados] = useState(clientes);
  const [editandoIndex, setEditandoIndex] = useState(null);

  // Filtrar clientes cuando cambia el searchQuery
  useEffect(() => {
    if (searchQuery) {
      const filtrados = clientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setClientesFiltrados(filtrados);
    } else {
      setClientesFiltrados(clientes);
    }
  }, [searchQuery, clientes]);

  const agregarOEditarLead = () => {
    if (!nuevoNombre) return;
    const cliente = { 
      nombre: nuevoNombre, 
      estado: nuevoEstado,
      plan: nuevoPlan
    };

    if (editandoIndex !== null) {
      modificarCliente(editandoIndex, cliente);
      setEditandoIndex(null);
    } else {
      agregarCliente(cliente);
    }

    setNuevoNombre('');
    setNuevoEstado('Nuevo Lead');
    setNuevoPlan('básico');
  };

  const prepararEdicion = (cliente, index) => {
    setNuevoNombre(cliente.nombre);
    setNuevoEstado(cliente.estado);
    setNuevoPlan(cliente.plan || 'básico');
    setEditandoIndex(index);
  };
  
  // Función para generar la clase CSS basada en el estado
  const getEstadoClass = (estado) => {
    switch(estado) {
      case 'Nuevo Lead':
        return 'estado-nuevo';
      case 'Cliente Activo':
        return 'estado-activo';
      case 'Negociación':
        return 'estado-negociacion';
      case 'Cliente Perdido':
        return 'estado-perdido';
      default:
        return '';
    }
  };
  
  // Función para generar la clase CSS basada en el plan
  const getPlanClass = (plan) => {
    switch(plan) {
      case 'básico':
        return 'plan-basico';
      case 'pro':
        return 'plan-pro';
      case 'premium':
        return 'plan-premium';
      default:
        return 'plan-basico';
    }
  };

  return (
    <div className="component-card customers-leads">
      <h2>Clientes y Leads</h2>

      <table className="leads-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Plan</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map((cliente, i) => {
            const clienteIndex = clientes.findIndex(c => c === cliente);
            return (
              <tr key={i}>
                <td>{cliente.nombre}</td>
                <td>
                  <span className={`estado-badge ${getEstadoClass(cliente.estado)}`}>
                    {cliente.estado}
                  </span>
                </td>
                <td>
                  <span className={`plan-badge-small ${getPlanClass(cliente.plan || 'básico')}`}>
                    {cliente.plan ? 
                      cliente.plan.charAt(0).toUpperCase() + cliente.plan.slice(1) : 
                      'Básico'
                    }
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-button edit-button"
                      onClick={() => prepararEdicion(cliente, clienteIndex)}
                    >
                      <span className="button-icon">✏️</span> Editar
                    </button>
                    <button 
                      className="action-button delete-button"
                      onClick={() => borrarCliente(clienteIndex)}
                    >
                      <span className="button-icon">🗑️</span> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
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
        <select
          value={nuevoPlan}
          onChange={(e) => setNuevoPlan(e.target.value)}
        >
          <option value="básico">Plan Básico</option>
          <option value="pro">Plan Pro</option>
          <option value="premium">Plan Premium</option>
        </select>
        <button onClick={agregarOEditarLead}>
          {editandoIndex !== null ? 'Guardar Cambios' : 'Agregar Cliente/Lead'}
        </button>
        {editandoIndex !== null && (
          <button
            onClick={() => {
              setNuevoNombre('');
              setNuevoEstado('Nuevo Lead');
              setNuevoPlan('básico');
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
