import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getClientes as apiClientes,
  addCliente as apiAddCliente,
  updateCliente as apiUpdateCliente,
  deleteCliente as apiDeleteCliente
} from '../services/api'; // Import API functions

const ClientesContext = createContext();

export function useClientes() {
  return useContext(ClientesContext);
}

export function ClientesProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial clientes data
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        setLoading(true);
        const data = await apiClientes();
        setClientes(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar clientes:", err);
        setClientes([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };
    cargarClientes();
  }, []);

  const agregarCliente = async (clienteData) => {
    try {
      const nuevoCliente = await apiAddCliente(clienteData);
      setClientes((prev) => [...prev, nuevoCliente]);
      return nuevoCliente;
    } catch (err) {
      setError(err.message);
      console.error("Error al agregar cliente:", err);
      throw err; // Re-throw to allow components to handle it
    }
  };

  const borrarCliente = async (clienteId) => {
    try {
      await apiDeleteCliente(clienteId);
      setClientes((prev) => prev.filter((cliente) => cliente.id !== clienteId));
    } catch (err) {
      setError(err.message);
      console.error("Error al borrar cliente:", err);
      throw err;
    }
  };

  const modificarCliente = async (clienteId, clienteData) => {
    try {
      const clienteActualizado = await apiUpdateCliente(clienteId, clienteData);
      setClientes((prev) =>
        prev.map((c) => (c.id === clienteId ? clienteActualizado : c))
      );
      return clienteActualizado;
    } catch (err) {
      setError(err.message);
      console.error("Error al modificar cliente:", err);
      throw err;
    }
  };
    const estadisticasPlanes = () => {
    const stats = {
      basico: 0,
      pro: 0,
      premium: 0,
      total: clientes.length
    };
    
    clientes.forEach(cliente => {
      if (cliente.plan === 'Plan Básico') stats.basico++;
      else if (cliente.plan === 'Plan Pro') stats.pro++;
      else if (cliente.plan === 'Plan Premium') stats.premium++;
    });
    
    return stats;
  };

  return (
    <ClientesContext.Provider
      value={{
        clientes,
        loading,
        error,
        agregarCliente,
        borrarCliente,
        modificarCliente,
        estadisticasPlanes
      }}
    >
      {children}
    </ClientesContext.Provider>
  );
}
