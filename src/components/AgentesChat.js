import React from 'react';
import './AgentesChat.css';

const AgentesChat = () => {
  return (
    <div className="agentes-banner-container">
      <div className="updates-banner">
        <div className="banner-content">
          <span className="banner-icon">🚀</span>
          <div className="banner-text">
            <strong>¡Próximas Actualizaciones!</strong>
            <span>Integración con GPT-4, nuevos agentes especializados y respuestas más inteligentes</span>
          </div>
          <span className="banner-badge">COMING SOON</span>
        </div>
      </div>
    </div>
  );
};

export default AgentesChat;
