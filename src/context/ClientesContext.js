import React, { createContext, useContext, useState } from 'react';

const ClientesContext = createContext();

export function useClientes() {
  return useContext(ClientesContext);  // Aquí exportamos el hook
}

export function ClientesProvider({ children }) {
  const [clientes, setClientes] = useState([
    { nombre: 'Juan Pérez', estado: 'Nuevo Lead' },
    { nombre: 'Ana Gómez', estado: 'Cliente Activo' },
    { nombre: 'Carlos Ruiz', estado: 'Negociación' },
    { nombre: 'Lucía Torres', estado: 'Nuevo Lead' },
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

  return (
    <ClientesContext.Provider
      value={{ clientes, agregarCliente, borrarCliente, modificarCliente }}
    >
      {children}
    </ClientesContext.Provider>
  );
}
