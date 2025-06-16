const API_BASE_URL = 'http://localhost/dashboard/CRM%20Wolty/CRM/api'; // Ruta corregida para XAMPP

// Helper function for handling API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Error en la solicitud a la API');
  }
  return response.json();
};

// --- Clientes (Customers/Leads) ---
export const getClientes = async (currentUser = null) => {
  try {
    // Construir URL con parámetros según el usuario
    let url = `${API_BASE_URL}/clientes/get.php`;
    const params = new URLSearchParams();
    
    if (currentUser) {
      params.append('role', currentUser.role || 'vendedor');
      params.append('user_id', currentUser.id || '');
    }
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url);
    const data = await handleResponse(response);
    
    // Transformar los datos para que coincidan con el frontend
    return data.map(cliente => ({
      id: cliente.id_cliente,
      nombre: cliente.nombre_cliente,
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      estado: cliente.tipo_estado,
      plan: cliente.Tipo_plan,
      vendedor: cliente.vendedor_nombre || cliente.vendedor_username || 'Sin asignar'
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

// --- KPIs ---
export const getKPIs = async (currentUser = null) => {
  try {
    // Construir URL con parámetros según el usuario
    let url = `${API_BASE_URL}/kpis/get.php`;
    const params = new URLSearchParams();
    
    if (currentUser) {
      params.append('role', currentUser.role || 'vendedor');
      params.append('user_id', currentUser.id || '');
    }
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url);
    const data = await handleResponse(response);
    
    if (data.success) {
      return data;
    } else {
      throw new Error(data.error || 'Error al obtener KPIs');
    }
  } catch (error) {
    console.error('Error al obtener KPIs:', error);
    // Devolver datos por defecto en caso de error
    return {
      kpis: {
        total_clientes: 0,
        clientes_calientes: 0,
        ingresos_estimados: 0,
        tasa_conversion: 0,
        usuarios_activos: 0,
        planes_activos: 0
      },
      estados: [],
      planes: [],
      metricas_detalladas: {
        frios: 0,
        tibios: 0,
        calientes: 0,
        perdidos: 0
      }
    };
  }
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
