import React, { useState, useRef, useEffect } from 'react';
import './AgentesChat.css';

const AgentesChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: '¡Hola! Soy tu asistente de IA de Cordova. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
      agent: 'Cordova IA'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('general');
  const messagesEndRef = useRef(null);

  const agents = [
    { id: 'general', name: 'Asistente General', icon: '🤖', color: '#7c3aed' },
    { id: 'ventas', name: 'Agente de Ventas', icon: '👨‍💼', color: '#10b981' },
    { id: 'agenda', name: 'Agente de Agenda', icon: '📅', color: '#f59e0b' },
    { id: 'supervisor', name: 'Agente Supervisor', icon: '🔍', color: '#ef4444' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular respuesta del bot (aquí irá la integración real con IA)
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        message: getBotResponse(inputMessage, selectedAgent),
        timestamp: new Date(),
        agent: agents.find(a => a.id === selectedAgent)?.name || 'Cordova IA'
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (message, agent) => {
    const responses = {
      general: [
        'Entiendo tu consulta. ¿Podrías darme más detalles para ayudarte mejor?',
        'Perfecto, estoy aquí para asistirte con cualquier duda sobre el CRM.',
        'Esa es una excelente pregunta. Te ayudo a resolverla paso a paso.'
      ],
      ventas: [
        'Como agente de ventas, puedo ayudarte a gestionar leads y cerrar más negocios.',
        'Te sugiero revisar el pipeline de ventas para optimizar tus conversiones.',
        'Basándome en los datos, aquí tienes algunas estrategias de venta...'
      ],
      agenda: [
        'Perfecto, puedo ayudarte a organizar tu agenda y programar citas.',
        'Te recomiendo establecer recordatorios para no perder ninguna oportunidad.',
        'Veo que tienes algunas actividades pendientes. ¿Te ayudo a priorizarlas?'
      ],
      supervisor: [
        'Como supervisor, aquí tienes un resumen de tu rendimiento actual...',
        'He analizado tus métricas y tengo algunas recomendaciones.',
        'Basándome en los KPIs, te sugiero enfocar la atención en...'
      ]
    };

    const agentResponses = responses[agent] || responses.general;
    return agentResponses[Math.floor(Math.random() * agentResponses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="agentes-chat-container">
      <div className="chat-header">
        <h2>Centro de Agentes IA</h2>
        <div className="agents-selector">
          {agents.map(agent => (
            <button
              key={agent.id}
              className={`agent-btn ${selectedAgent === agent.id ? 'active' : ''}`}
              onClick={() => setSelectedAgent(agent.id)}
              style={{ '--agent-color': agent.color }}
            >
              <span className="agent-icon">{agent.icon}</span>
              <span className="agent-name">{agent.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="chat-messages">
        {messages.map(message => (
          <div
            key={message.id}
            className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              {message.type === 'bot' && (
                <div className="bot-avatar">
                  {agents.find(a => a.name === message.agent)?.icon || '🤖'}
                </div>
              )}
              <div className="message-bubble">
                <p>{message.message}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot-message">
            <div className="message-content">
              <div className="bot-avatar">
                {agents.find(a => a.id === selectedAgent)?.icon || '🤖'}
              </div>
              <div className="message-bubble typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="chat-input">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Escribe tu mensaje para ${agents.find(a => a.id === selectedAgent)?.name}...`}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="send-button"
          >
            <span>📤</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentesChat;
