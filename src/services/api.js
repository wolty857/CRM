const API_BASE_URL = '/api'; // Adjust this to your actual backend API base URL

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
  // return fetch(`${API_BASE_URL}/clientes`).then(handleResponse);
  console.warn('API: getClientes no implementado. Usando datos de demostración vacíos.');
  return Promise.resolve([]); // Placeholder
};

export const addCliente = async (clienteData) => {
  // return fetch(`${API_BASE_URL}/clientes`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(clienteData),
  // }).then(handleResponse);
  console.warn('API: addCliente no implementado.');
  return Promise.resolve({ id: Date.now(), ...clienteData }); // Placeholder
};

export const updateCliente = async (clienteId, clienteData) => {
  // return fetch(`${API_BASE_URL}/clientes/${clienteId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(clienteData),
  // }).then(handleResponse);
  console.warn('API: updateCliente no implementado.');
  return Promise.resolve({ id: clienteId, ...clienteData }); // Placeholder
};

export const deleteCliente = async (clienteId) => {
  // return fetch(`${API_BASE_URL}/clientes/${clienteId}`, {
  //   method: 'DELETE',
  // }).then(handleResponse);
  console.warn('API: deleteCliente no implementado.');
  return Promise.resolve({ message: 'Cliente eliminado (simulado)' }); // Placeholder
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
