import axios from 'axios';

const CALENDAR_BASE_URL = 'https://www.googleapis.com/calendar/v3';

/**
 * Lista los próximos eventos del calendario primario del usuario
 * @param {string} accessToken Token OAuth 2.0 con scope calendar.readonly
 * @param {number} maxResults Máximo número de eventos a devolver
 */
export const listUpcomingEvents = async (accessToken, maxResults = 20) => {
  if (!accessToken) throw new Error('No access token provided');

  const nowIso = new Date().toISOString();
  const response = await axios.get(`${CALENDAR_BASE_URL}/calendars/primary/events`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      maxResults,
      orderBy: 'startTime',
      singleEvents: true,
      timeMin: nowIso,
    },
  });

  return response.data.items || [];
}; 