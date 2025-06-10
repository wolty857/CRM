import React, { useState, useEffect } from 'react';
import './CustomersLeads.css';
import { useClientes } from '../context/ClientesContext';

function CustomersLeads({ searchQuery }) {
  const { 
    clientes, 
    agregarCliente, 
    borrarCliente, 
    modificarCliente, 
    loading, 
    error 
  } = useClientes();
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoEmail, setNuevoEmail] = useState(''); // Added email
  const [nuevoTelefono, setNuevoTelefono] = useState(''); // Added phone
  const [nuevoEstado, setNuevoEstado] = useState('Frío');
  const [nuevoPlan, setNuevoPlan] = useState('Plan Básico');
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [editandoId, setEditandoId] = useState(null); // Changed from index to ID

  // Filtrar clientes cuando cambia el searchQuery o clientes
  useEffect(() => {
    if (searchQuery) {
      const filtrados = clientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cliente.email && cliente.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setClientesFiltrados(filtrados);
    } else {
      setClientesFiltrados(clientes); // This will be an empty array initially
    }
  }, [searchQuery, clientes]);

  const resetForm = () => {
    setNuevoNombre('');
    setNuevoEmail('');
    setNuevoTelefono('');    setNuevoEstado('Frío');
    setNuevoPlan('Plan Básico');
    setEditandoId(null);
  };

  const handleAgregarOEditarLead = async () => {
    if (!nuevoNombre) {
      alert('El nombre es obligatorio.'); // Basic validation
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
  };
    // Función para generar la clase CSS basada en el estado
  const getEstadoClass = (estado) => {
    switch(estado) {
      case 'Frío':
        return 'estado-nuevo';
      case 'Tibio':
        return 'estado-negociacion';
      case 'Caliente':
        return 'estado-activo';
      case 'Cliente Perdido':
        return 'estado-perdido';
      default:
        return '';
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
      <h2>Clientes y Leads</h2>

      {clientesFiltrados.length === 0 && !searchQuery && (
        <div className="no-data-message">
          <p>Aún no hay clientes o leads registrados.</p>
          <p>Utiliza el formulario de abajo para agregar el primero.</p>
        </div>
      )}
      {clientesFiltrados.length === 0 && searchQuery && (
         <div className="no-data-message">
          <p>No se encontraron clientes con el término "{searchQuery}".</p>
        </div>
      )}

      {clientesFiltrados.length > 0 && (
        <table className="leads-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Plan</th>
              <th>Acciones</th>
            </tr>
          </thead>          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.email || '-'}</td>
                <td>{cliente.telefono || '-'}</td>
                <td>
                  <span className={`estado-badge ${getEstadoClass(cliente.estado)}`}>
                    {cliente.estado}
                  </span>
                </td>                <td>
                  <span className={`plan-badge-small ${getPlanClass(cliente.plan || 'Plan Básico')}`}>
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
      )}

      <div className="add-lead-form">
        <h3>{editandoId !== null ? 'Editar Cliente/Lead' : 'Agregar Nuevo Cliente/Lead'}</h3>
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email del cliente"
          value={nuevoEmail}
          onChange={(e) => setNuevoEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Teléfono del cliente"
          value={nuevoTelefono}
          onChange={(e) => setNuevoTelefono(e.target.value)}
        />        <select
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
          {editandoId !== null ? 'Guardar Cambios' : 'Agregar Cliente'}
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
