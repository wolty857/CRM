import React, { createContext, useContext, useState } from 'react';

const ClientesContext = createContext();

export function useClientes() {
  return useContext(ClientesContext);  // Aquí exportamos el hook
}

export function ClientesProvider({ children }) {
  const [clientes, setClientes] = useState([
    { nombre: 'Juan Pérez', estado: 'Nuevo Lead', plan: 'básico' },
    { nombre: 'Ana Gómez', estado: 'Cliente Activo', plan: 'pro' },
    { nombre: 'Carlos Ruiz', estado: 'Negociación', plan: 'premium' },
    { nombre: 'Lucía Torres', estado: 'Nuevo Lead', plan: 'básico' },
    { nombre: 'Roberto Méndez', estado: 'Cliente Activo', plan: 'premium' },
    { nombre: 'Sofía Vargas', estado: 'Cliente Perdido', plan: 'básico' },
  ]);

  const agregarCliente = (cliente) => {
    setClientes((prev) => [...prev, cliente]);
  };

  const borrarCliente = (index) => {
    setClientes((prev) => prev.filter((_, i) => i !== index));
  };

  const modificarCliente = (index, nuevoCliente) => {
    setClientes((prev) =>
      prev.map((c, i) => (i === index ? nuevoCliente : c))
    );
  };
  
  // Obtener estadísticas sobre los planes
  const estadisticasPlanes = () => {
    const stats = {
      basico: 0,
      pro: 0,
      premium: 0,
      total: clientes.length
    };
    
    clientes.forEach(cliente => {
      if (cliente.plan === 'básico') stats.basico++;
      else if (cliente.plan === 'pro') stats.pro++;
      else if (cliente.plan === 'premium') stats.premium++;
    });
    
    return stats;
  };

  return (
    <ClientesContext.Provider
      value={{ 
        clientes, 
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
