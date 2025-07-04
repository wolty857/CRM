import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { listUpcomingEvents } from '../services/googleCalendar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import './AgendaActivities.css';

function AgendaActivities() {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('google_access_token'));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configuramos el login
  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    onSuccess: (tokenResponse) => {
      const token = tokenResponse.access_token;
      localStorage.setItem('google_access_token', token);
      setAccessToken(token);
    },
    onError: () => setError('Error al autenticar con Google'),
  });

  // Cargar eventos cuando tengamos token
  useEffect(() => {
    if (!accessToken) return;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const items = await listUpcomingEvents(accessToken, 20);
        setEvents(items);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los eventos');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [accessToken]);

  // Vista mientras no está conectado
  if (!accessToken) {
    return (
      <div className="agenda-container not-connected">
        <img
          src="https://static.vecteezy.com/system/resources/previews/022/613/030/original/google-calendar-icon-logo-symbol-free-png.png"
          alt="Google Calendar"
          className="calendar-logo"
        />
        <h2>Google Calendar</h2>
        <button className="google-connect-btn" onClick={() => login()}>
          Conectar con Google Calendar
        </button>
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }

  // Vista principal
  const calendarEvents = events.map(evt => ({
    id: evt.id,
    title: evt.summary,
    start: evt.start.dateTime || evt.start.date,
    end: evt.end?.dateTime || evt.end?.date,
    allDay: !evt.start.dateTime,
  }));

  return (
    <div className="agenda-container">
      <div className="google-badge">
        <img src="https://static.vecteezy.com/system/resources/previews/022/613/030/original/google-calendar-icon-logo-symbol-free-png.png" alt="Google Calendar" />
        <span>Google Calendar</span>
      </div>
      {loading && <p>Cargando eventos…</p>}
      {error && <p className="error-text">{error}</p>}
      <div className="calendar-wrapper">
        <div className="calendar-main">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay'
            }}
            locale={esLocale}
            events={calendarEvents}
            height="auto"
          />
        </div>
        <aside className="events-sidebar">
          <h3>Próximos eventos</h3>
          {!loading && calendarEvents.length === 0 && <p>No hay eventos próximos.</p>}
          <ul className="events-list">
            {calendarEvents.slice(0, 10).map(evt => {
              const dateObj = new Date(evt.start);
              const fecha = dateObj.toLocaleDateString();
              const hora = evt.allDay ? 'Todo el día' : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <li key={evt.id} className="event-item">
                  <div className="event-date">{fecha}</div>
                  <div className="event-info">
                    <span className="event-title">{evt.title}</span>
                    <span className="event-time">{hora}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default AgendaActivities;
