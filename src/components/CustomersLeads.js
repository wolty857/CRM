import React, { useState, useEffect } from 'react';
import './CustomersLeads.css';
import { useClientes } from '../context/ClientesContext';

function CustomersLeads({ searchQuery, currentUser }) {
  const { 
    clientes, 
    agregarCliente, 
    borrarCliente, 
    modificarCliente, 
    loading, 
    error 
  } = useClientes();
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevoTelefono, setNuevoTelefono] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('Frío');
  const [nuevoPlan, setNuevoPlan] = useState('Plan Básico');
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroPlan, setFiltroPlan] = useState('Todos');
  // Filtrar clientes cuando cambia el searchQuery, clientes o filtros
  useEffect(() => {
    let filtrados = clientes;

    // Filtro por búsqueda
    if (searchQuery) {
      filtrados = filtrados.filter(cliente => 
        cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cliente.email && cliente.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filtro por estado
    if (filtroEstado !== 'Todos') {
      filtrados = filtrados.filter(cliente => cliente.estado === filtroEstado);
    }

    // Filtro por plan
    if (filtroPlan !== 'Todos') {
      filtrados = filtrados.filter(cliente => cliente.plan === filtroPlan);
    }

    setClientesFiltrados(filtrados);
  }, [searchQuery, clientes, filtroEstado, filtroPlan]);
  const resetForm = () => {
    setNuevoNombre('');
    setNuevoEmail('');
    setNuevoTelefono('');
    setNuevoEstado('Frío');
    setNuevoPlan('Plan Básico');
    setEditandoId(null);
  };

  const handleAgregarOEditarLead = async () => {
    if (!nuevoNombre) {
      alert('El nombre es obligatorio.');
      return;
    }
    const clienteData = { 
      nombre: nuevoNombre, 
      email: nuevoEmail,
      telefono: nuevoTelefono,
      estado: nuevoEstado,
      plan: nuevoPlan
    };

    try {
      if (editandoId !== null) {
        await modificarCliente(editandoId, clienteData);
      } else {
        await agregarCliente(clienteData);
      }
      resetForm();
    } catch (apiError) {
      // Error is already logged in context, can show user feedback here
      alert(`Error al guardar cliente: ${apiError.message}`);
    }
  };
  const prepararEdicion = (cliente) => {
    setNuevoNombre(cliente.nombre);
    setNuevoEmail(cliente.email || '');
    setNuevoTelefono(cliente.telefono || '');
    setNuevoEstado(cliente.estado);
    setNuevoPlan(cliente.plan || 'Plan Básico');
    setEditandoId(cliente.id);
  };

  const handleBorrarCliente = async (clienteId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await borrarCliente(clienteId);
      } catch (apiError) {
        alert(`Error al eliminar cliente: ${apiError.message}`);
      }
    }
  };  // Función para generar la clase CSS basada en el estado
  const getEstadoClass = (estado) => {
    switch(estado) {
      case 'Frío':
        return 'estado-frio';
      case 'Tibio':
        return 'estado-tibio';
      case 'Caliente':
        return 'estado-caliente';
      case 'Cliente Perdido':
        return 'estado-perdido';
      default:
        return 'estado-frio';
    }
  };
  
  // Función para generar la clase CSS basada en el plan
  const getPlanClass = (plan) => {
    switch(plan) {
      case 'Plan Básico':
        return 'plan-basico';
      case 'Plan Pro':
        return 'plan-pro';
      case 'Plan Premium':
        return 'plan-premium';
      default:
        return 'plan-basico';
    }
  };

  if (loading) {
    return <div className="component-card customers-leads"><p>Cargando clientes...</p></div>;
  }

  if (error) {
    return <div className="component-card customers-leads"><p className="error-message">Error al cargar datos: {error}</p></div>;
  }
  return (
    <div className="component-card customers-leads">
      <h2>Leads</h2>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Estado:</label>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="Todos">Todos los estados</option>
            <option value="Frío">Frío</option>
            <option value="Tibio">Tibio</option>
            <option value="Caliente">Caliente</option>
            <option value="Cliente Perdido">Cliente Perdido</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Plan:</label>
          <select value={filtroPlan} onChange={(e) => setFiltroPlan(e.target.value)}>
            <option value="Todos">Todos los planes</option>
            <option value="Plan Básico">Plan Básico</option>
            <option value="Plan Pro">Plan Pro</option>
            <option value="Plan Premium">Plan Premium</option>
          </select>
        </div>
        <div className="filter-stats">
          <span className="stats-item">Total: {clientesFiltrados.length}</span>
        </div>
      </div>      {clientesFiltrados.length === 0 && !searchQuery && filtroEstado === 'Todos' && filtroPlan === 'Todos' && (
        <div className="no-data-message">
          <p>Aún no hay leads registrados.</p>
          <p>Utiliza el formulario de abajo para agregar el primero.</p>
        </div>
      )}
      {clientesFiltrados.length === 0 && (searchQuery || filtroEstado !== 'Todos' || filtroPlan !== 'Todos') && (
         <div className="no-data-message">
          <p>No se encontraron leads con los filtros aplicados.</p>
        </div>
      )}

      {clientesFiltrados.length > 0 && (        <table className="leads-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Plan</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.email || '-'}</td>
                <td>{cliente.telefono || '-'}</td>
                <td>
                  <span className={`estado-badge ${getEstadoClass(cliente.estado)}`}>
                    {cliente.estado}
                  </span>
                </td>
                <td>
                  <span className={`plan-badge ${getPlanClass(cliente.plan || 'Plan Básico')}`}>
                    {cliente.plan || 'Plan Básico'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-button edit-button"
                      onClick={() => prepararEdicion(cliente)}
                    >
                      <span className="button-icon">✏️</span> Editar
                    </button>
                    <button 
                      className="action-button delete-button"
                      onClick={() => handleBorrarCliente(cliente.id)}
                    >
                      <span className="button-icon">🗑️</span> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}      <div className="add-lead-form">
        <h3>{editandoId !== null ? 'Editar Lead' : 'Agregar Nuevo Lead'}</h3>
        <input
          type="text"
          placeholder="Nombre del lead"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email del lead"
          value={nuevoEmail}
          onChange={(e) => setNuevoEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Teléfono del lead"
          value={nuevoTelefono}
          onChange={(e) => setNuevoTelefono(e.target.value)}
        />
        <select
          value={nuevoEstado}
          onChange={(e) => setNuevoEstado(e.target.value)}
        >
          <option value="Frío">Frío</option>
          <option value="Tibio">Tibio</option>
          <option value="Caliente">Caliente</option>
          <option value="Cliente Perdido">Cliente Perdido</option>
        </select>
        <select
          value={nuevoPlan}
          onChange={(e) => setNuevoPlan(e.target.value)}
        >
          <option value="Plan Básico">Plan Básico</option>
          <option value="Plan Pro">Plan Pro</option>
          <option value="Plan Premium">Plan Premium</option>
        </select>
        <button onClick={handleAgregarOEditarLead}>
          {editandoId !== null ? 'Guardar Cambios' : 'Agregar Lead'}
        </button>
        {editandoId !== null && (
          <button onClick={resetForm} className="secondary-action">
            Cancelar Edición
          </button>
        )}
      </div>
    </div>
  );
}

export default CustomersLeads;
