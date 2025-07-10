
const API_BASE_URL = 'http://localhost/dashboard/CRM/api'; // Ruta corregida para XAMPP


// Helper function for handling API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Error en la solicitud a la API');
  }
  return response.json();
};

// --- Clientes (Customers/Leads) ---
export const getClientes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes/get.php`);
    const data = await handleResponse(response);
    
    // Transformar los datos para que coincidan con el frontend
    return data.map(cliente => ({
      id: cliente.id_cliente,
      nombre: cliente.nombre_cliente,
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      estado: cliente.tipo_estado,
      plan: cliente.Tipo_plan
    }));
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }
};

export const addCliente = async (clienteData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes/post.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: clienteData.nombre,
        email: clienteData.email,
        telefono: clienteData.telefono,
        estado: clienteData.estado,
        plan: clienteData.plan
      }),
    });
    
    const result = await handleResponse(response);
    if (result.success) {
      // Devolver el cliente con un ID temporal (el backend debería devolver el ID real)
      return { 
        id: result.id || Date.now(), 
        ...clienteData 
      };
    } else {
      throw new Error(result.error || 'Error al agregar cliente');
    }
  } catch (error) {
    console.error('Error al agregar cliente:', error);
    throw error;
  }
};

export const updateCliente = async (clienteId, clienteData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes/put.php`, {
      method: 'POST', // PHP maneja PUT como POST
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: clienteId,
        nombre: clienteData.nombre,
        email: clienteData.email,
        telefono: clienteData.telefono,
        estado: clienteData.estado,
        plan: clienteData.plan
      }),
    });
    
    const result = await handleResponse(response);
    if (result.success) {
      return { id: clienteId, ...clienteData };
    } else {
      throw new Error(result.error || 'Error al actualizar cliente');
    }
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    throw error;
  }
};

export const deleteCliente = async (clienteId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes/delete.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: clienteId }),
    });
    
    const result = await handleResponse(response);
    if (result.success) {
      return { message: 'Cliente eliminado correctamente' };
    } else {
      throw new Error(result.error || 'Error al eliminar cliente');
    }
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    throw error;
  }
};

// --- Actividades (Agenda) ---
export const getActividades = async () => {
  // return fetch(`${API_BASE_URL}/actividades`).then(handleResponse);
  console.warn('API: getActividades no implementado. Usando datos de demostración vacíos.');
  return Promise.resolve([]); // Placeholder
};

export const addActividad = async (actividadData) => {
  // return fetch(`${API_BASE_URL}/actividades`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(actividadData),
  // }).then(handleResponse);
  console.warn('API: addActividad no implementado.');
  return Promise.resolve({ id: Date.now(), ...actividadData }); // Placeholder
};

// --- Pipeline de Ventas (Etapas) ---
export const getEtapasPipeline = async () => {
  // return fetch(`${API_BASE_URL}/pipeline`).then(handleResponse);
  console.warn('API: getEtapasPipeline no implementado. Usando datos de demostración vacíos.');
  return Promise.resolve([]); // Placeholder
};

// --- KPIs ---
export const getKPIs = async () => {
  // return fetch(`${API_BASE_URL}/kpis`).then(handleResponse);
  console.warn('API: getKPIs no implementado. Usando datos de demostración vacíos.');
  return Promise.resolve({ // Placeholder
    totalClientes: 0,
    nuevosLeadsMes: 0,
    tasaConversion: 0,
    ingresosGenerados: 0,
  });
};

// --- Visual Reports (Chart Data) ---
export const getReporteCrecimientoClientes = async () => {
  // return fetch(`${API_BASE_URL}/reportes/crecimiento-clientes`).then(handleResponse);
  console.warn('API: getReporteCrecimientoClientes no implementado. Usando datos de demostración vacíos.');
  return Promise.resolve([]); // Placeholder
};

export const getReporteConversionLeads = async () => {
  // return fetch(`${API_BASE_URL}/reportes/conversion-leads`).then(handleResponse);
  console.warn('API: getReporteConversionLeads no implementado. Usando datos de demostración vacíos.');
  return Promise.resolve([]); // Placeholder
};

// Función de prueba para verificar la conexión
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/test.php`);
    const data = await handleResponse(response);
    console.log('Conexión API exitosa:', data);
    return data;
  } catch (error) {
    console.error('Error de conexión API:', error);
    throw error;
  }
};

// Add more API functions as needed for other data types (e.g., DataManagement)

// Example of a more generic fetch function if needed
// const apiRequest = async (endpoint, method = 'GET', body = null) => {
//   const options = {
//     method,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };
//   if (body) {
//     options.body = JSON.stringify(body);
//   }
//   const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
//   return handleResponse(response);
// };
