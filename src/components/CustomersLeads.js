import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomersLeads.css';

function CustomersLeads({ searchQuery }) {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('Frío');
  const [nuevoPlan, setNuevoPlan] = useState('básico');
  const [editandoCliente, setEditandoCliente] = useState(null);

  // Cargar clientes desde la base de datos al iniciar
  useEffect(() => {
    obtenerClientes();
  }, []);

  // Actualizar clientes filtrados cuando cambia la búsqueda o la lista
  useEffect(() => {
    if (searchQuery) {
      const filtrados = clientes.filter(cliente =>
        cliente.nombre_cliente.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setClientesFiltrados(filtrados);
    } else {
      setClientesFiltrados(clientes);
    }
  }, [searchQuery, clientes]);

  const obtenerClientes = async () => {
    try {
      const res = await axios.get('http://localhost/CRM/api/clientes/get.php');
      setClientes(res.data);
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  };

  const agregarOEditarCliente = async () => {
    if (!nuevoNombre) return;

    const nuevoCliente = {
      nombre: nuevoNombre,
      estado: nuevoEstado,
      plan: nuevoPlan,
    };

    try {
      if (editandoCliente) {
        await axios.put('http://localhost/CRM/api/clientes/put.php', {
          id: editandoCliente.id_cliente,
          ...nuevoCliente,
        });
      } else {
        await axios.post('http://localhost/CRM/api/clientes/post.php', nuevoCliente);
      }

      await obtenerClientes();
      cancelarEdicion();
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
    }
  };

  const eliminarCliente = async (id) => {
    try {
      await axios.delete(`http://localhost/CRM/api/clientes/delete.php?id=${id}`);
      await obtenerClientes();
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    }
  };

  const prepararEdicion = (cliente) => {
    setNuevoNombre(cliente.nombre_cliente);
    setNuevoEstado(cliente.tipo_estado);
    setNuevoPlan(cliente.Tipo_plan);
    setEditandoCliente(cliente);
  };

  const cancelarEdicion = () => {
    setNuevoNombre('');
    setNuevoEstado('Frío');
    setNuevoPlan('básico');
    setEditandoCliente(null);
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'Frío':
        return 'estado-frio';
      case 'Tibio':
        return 'estado-tibio';
      case 'Caliente':
        return 'estado-caliente';
      case 'Cliente Perdido':
        return 'estado-perdido';
      default:
        return '';
    }
  };

  const getPlanClass = (plan) => {
    switch (plan) {
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
          {clientesFiltrados.map((cliente) => (
            <tr key={cliente.id_cliente}>
              <td>{cliente.nombre_cliente}</td>
              <td>
                <span className={`estado-badge ${getEstadoClass(cliente.tipo_estado)}`}>
                  {cliente.tipo_estado}
                </span>
              </td>
              <td>
                <span className={`plan-badge-small ${getPlanClass(cliente.Tipo_plan)}`}>
                  {cliente.Tipo_plan}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="action-button edit-button"
                    onClick={() => prepararEdicion(cliente)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={() => eliminarCliente(cliente.id_cliente)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
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
        <select value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)}>
          <option>Frío</option>
          <option>Tibio</option>
          <option>Caliente</option>
          <option>Cliente Perdido</option>
        </select>
        <select value={nuevoPlan} onChange={(e) => setNuevoPlan(e.target.value)}>
          <option value="básico">Plan Básico</option>
          <option value="pro">Plan Pro</option>
          <option value="premium">Plan Premium</option>
        </select>
        <button onClick={agregarOEditarCliente}>
          {editandoCliente ? 'Guardar Cambios' : 'Agregar Cliente/Lead'}
        </button>
        {editandoCliente && (
          <button onClick={cancelarEdicion}>Cancelar</button>
        )}
      </div>
    </div>
  );
}

export default CustomersLeads;
