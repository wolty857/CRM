import React from 'react';
import './AgendaActivities.css';

function AgendaActivities() {
  return (
    <div className="agenda-container">
      <div className="coming-soon-card">
        <div className="coming-soon-icon">
          📅
        </div>
        <h2>Integración con Google Calendar</h2>
        <p>Estamos trabajando en conectar tu agenda personal con Google Calendar para que puedas:</p>
        
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <span>Sincronización automática de eventos</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⏰</span>
            <span>Recordatorios de seguimiento a clientes</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📞</span>
            <span>Programación de llamadas y reuniones</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span>Gestión de tareas y objetivos diarios</span>
          </div>
        </div>
        
        <div className="progress-indicator">
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '75%'}}></div>
          </div>
          <span className="progress-text">75% completado</span>
        </div>
        
        <p className="eta-text">
          <strong>Disponible próximamente</strong> - Integración en desarrollo
        </p>
      </div>
    </div>
  );
}

export default AgendaActivities;
