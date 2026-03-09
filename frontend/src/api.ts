/** URL del API: en tiempo de ejecución se puede sobreescribir con config.json (útil para túneles). */
function getApiUrl(): string {
  if (typeof window !== 'undefined' && (window as { __API_URL__?: string }).__API_URL__) {
    return (window as { __API_URL__: string }).__API_URL__;
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:3001';
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const api = {
  events: {
    list: (params?: { from?: string; to?: string; date?: string }) => {
      const q = new URLSearchParams(params as Record<string, string>).toString();
      return request<import('./types').Event[]>(`/api/events${q ? `?${q}` : ''}`);
    },
    get: (id: number) => request<import('./types').Event>(`/api/events/${id}`),
    create: (body: { title: string; description?: string; start_at: string; end_at?: string; type?: string }) =>
      request<import('./types').Event>('/api/events', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: number, body: Partial<import('./types').Event>) =>
      request<import('./types').Event>(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: number) => request<void>(`/api/events/${id}`, { method: 'DELETE' }),
  },
  ollama: {
    health: () => request<{ ok: boolean; models?: string[]; error?: string }>('/api/ollama/health'),
    summarizeDay: (date: string) =>
      request<{ date: string; summary: string; events: import('./types').Event[] }>('/api/ollama/summarize-day', {
        method: 'POST',
        body: JSON.stringify({ date }),
      }),
    suggestReminder: (eventId?: number, date?: string) =>
      request<{ reminder: string; events: import('./types').Event[] }>('/api/ollama/suggest-reminder', {
        method: 'POST',
        body: JSON.stringify(eventId ? { eventId } : { date }),
      }),
    suggestOrganization: (tasks: string[]) =>
      request<{ suggestion: string }>('/api/ollama/suggest-organization', {
        method: 'POST',
        body: JSON.stringify({ tasks }),
      }),
  },
  reminders: {
    pending: (hours?: number) =>
      request<{ events: import('./types').Event[]; from: string; to: string }>(
        `/api/reminders/pending${hours != null ? `?hours=${hours}` : ''}`
      ),
  },
};
