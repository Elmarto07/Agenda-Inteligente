import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { Event } from '../types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function HomeView() {
  const [pending, setPending] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [todaySummary, setTodaySummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [tasksText, setTasksText] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  const fetchTodaySummary = async () => {
    setSummaryLoading(true);
    setTodaySummary(null);
    try {
      const date = new Date().toISOString().slice(0, 10);
      const res = await api.ollama.summarizeDay(date);
      setTodaySummary(res.summary);
    } catch {
      setTodaySummary('No se pudo obtener. ¿Ollama está en marcha?');
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchSuggestion = async () => {
    const tasks = tasksText.trim().split('\n').filter(Boolean);
    if (tasks.length === 0) return;
    setSuggestionLoading(true);
    setSuggestion(null);
    try {
      const res = await api.ollama.suggestOrganization(tasks);
      setSuggestion(res.suggestion);
    } catch {
      setSuggestion('No se pudo obtener. ¿Ollama está en marcha?');
    } finally {
      setSuggestionLoading(false);
    }
  };

  useEffect(() => {
    api.reminders.pending(24 * 7)
      .then((r) => setPending(r.events))
      .catch(() => setPending([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="view home-view">
      <h1>Agenda Inteligente</h1>
      <nav className="main-nav">
        <Link to="/dia">Ver día</Link>
        <Link to="/semana">Ver semana</Link>
      </nav>
      <div className="home-block">
        <h2>Próximos compromisos</h2>
        {loading ? (
          <p>Cargando…</p>
        ) : pending.length === 0 ? (
          <p>No tienes eventos en las próximas 24 horas.</p>
        ) : (
          <ul className="pending-list">
            {pending.slice(0, 10).map((e) => (
              <li key={e.id}>
                <span className="pending-time">{formatDate(e.start_at)}</span>
                <strong>{e.title}</strong>
                {e.description && <span className="pending-desc">{e.description}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="home-block ai-block">
        <h2>Resumen del día (IA)</h2>
        <button type="button" onClick={fetchTodaySummary} disabled={summaryLoading}>
          {summaryLoading ? '…' : 'Resumir hoy con Qwen'}
        </button>
        {todaySummary && <p className="ai-result">{todaySummary}</p>}
      </div>
      <div className="home-block ai-block">
        <h2>Organizar tareas (IA)</h2>
        <p className="hint">Escribe una tarea por línea y pide una sugerencia de orden.</p>
        <textarea
          value={tasksText}
          onChange={(e) => setTasksText(e.target.value)}
          placeholder={'Comprar leche\nReunión con Ana\nGym'}
          rows={4}
          className="tasks-input"
        />
        <button type="button" onClick={fetchSuggestion} disabled={suggestionLoading || !tasksText.trim()}>
          {suggestionLoading ? '…' : 'Sugerir orden'}
        </button>
        {suggestion && <p className="ai-result">{suggestion}</p>}
      </div>
    </section>
  );
}
