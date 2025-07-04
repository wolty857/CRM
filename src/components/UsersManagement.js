import React, { useState, useEffect } from 'react';
import './UsersManagement.css';
import { BsShieldLockFill, BsPersonBadge, BsEnvelope, BsGem, BsCalendar, BsPencilSquare, BsTrash, BsSave, BsX, BsPlus } from 'react-icons/bs';

function UsersManagement({ searchQuery, isDarkMode }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [newUser, setNewUser] = useState({
    username: '',
    nombre_completo: '',
    email: '',
    role: 'vendedor',
    plan: 'básico'
  });

  // Cargar usuarios desde la API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/dashboard/CRM%20Wolty/CRM/api/users/get.php');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users || []);
      } else {
        throw new Error(data.message || 'Error al cargar usuarios');
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuarios por búsqueda
  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
    user.nombre_completo?.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
    user.email?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/dashboard/CRM%20Wolty/CRM/api/users/post.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUser,
          password: 'password123' // Password temporal
        })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchUsers();
        setNewUser({ username: '', nombre_completo: '', email: '', role: 'vendedor', plan: 'básico' });
        setShowAddForm(false);
      } else {
        throw new Error(data.message || 'Error al crear usuario');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const response = await fetch('http://localhost/dashboard/CRM%20Wolty/CRM/api/users/delete.php', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userId })
        });
        
        const data = await response.json();
        if (data.success) {
          await fetchUsers();
        } else {
          throw new Error(data.message || 'Error al eliminar usuario');
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/dashboard/CRM%20Wolty/CRM/api/users/put.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchUsers();
        setEditingUser(null);
        setError(null);
      } else {
        throw new Error(data.message || 'Error al actualizar usuario');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setError(null);
  };

  const getRoleIcon = (role) => {
    return role === 'admin' ? <BsShieldLockFill /> : <BsPersonBadge />;
  };

  const getRoleBadgeClass = (role) => {
    return role === 'admin' ? 'role-admin' : 'role-vendedor';
  };

  if (loading) return <div className="loading">Cargando usuarios...</div>;
  return (
    <div className={`users-management ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="users-header">
        <h2>Gestión de Usuarios del Sistema</h2>
        <p>Administra vendedores y usuarios registrados en la plataforma</p>
        <button 
          className="add-user-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? (<><BsX /> Cancelar</>) : (<><BsPlus /> Agregar Usuario</>)}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="add-user-form">
          <h3>Nuevo Usuario</h3>
          <form onSubmit={handleAddUser}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Nombre completo"
                value={newUser.nombre_completo}
                onChange={(e) => setNewUser({...newUser, nombre_completo: e.target.value})}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="vendedor">Vendedor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="form-row">
              <select
                value={newUser.plan}
                onChange={(e) => setNewUser({...newUser, plan: e.target.value})}
              >
                <option value="básico">Plan Básico</option>
                <option value="premium">Plan Premium</option>
                <option value="empresarial">Plan Empresarial</option>
              </select>
              <button type="submit">Crear Usuario</button>
            </div>
          </form>
        </div>
      )}

      <div className="users-list">
        {filteredUsers.length === 0 ? (
          <div className="no-users">
            No se encontraron usuarios
          </div>
        ) : (
          <div className="users-grid">
            {filteredUsers.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-header">
                  <div className="user-info">
                    <h3>{user.nombre_completo || user.username}</h3>
                    <p className="username">@{user.username}</p>
                  </div>
                  <div className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                    {getRoleIcon(user.role)} {user.role === 'admin' ? 'Admin' : 'Vendedor'}
                  </div>
                </div>
                
                <div className="user-details">
                  <div className="detail-item">
                    <span className="label"><BsEnvelope /> Email:</span>
                    <span className="value">{user.email || 'No especificado'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label"><BsGem /> Plan:</span>
                    <span className="value">{user.plan || 'Básico'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label"><BsCalendar /> Creado:</span>
                    <span className="value">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="user-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => setEditingUser(user)}
                  >
                    <BsPencilSquare /> Editar
                  </button>
                  {user.role !== 'admin' && (
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <BsTrash /> Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingUser && (
        <div className="edit-user-form">
          <h3>Editar Usuario</h3>
          <form onSubmit={handleEditUser}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={editingUser.username || ''}
                onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Nombre completo"
                value={editingUser.nombre_completo || ''}
                onChange={(e) => setEditingUser({...editingUser, nombre_completo: e.target.value})}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="email"
                placeholder="Email"
                value={editingUser.email || ''}
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                required
              />
              <select
                value={editingUser.role || 'vendedor'}
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
              >
                <option value="vendedor">Vendedor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="form-row">
              <select
                value={editingUser.plan || 'básico'}
                onChange={(e) => setEditingUser({...editingUser, plan: e.target.value})}
              >
                <option value="básico">Plan Básico</option>
                <option value="premium">Plan Premium</option>
                <option value="empresarial">Plan Empresarial</option>
              </select>
              <input
                type="password"
                placeholder="Nueva contraseña (opcional)"
                value={editingUser.password || ''}
                onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
              />
            </div>
            <div className="form-row">
              <button type="submit" className="save-btn"><BsSave /> Guardar Cambios</button>
              <button type="button" className="cancel-btn" onClick={cancelEdit}><BsX /> Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default UsersManagement;
