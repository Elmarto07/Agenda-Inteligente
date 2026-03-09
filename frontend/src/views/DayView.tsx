import { useState, useEffect } from 'react';
import { api } from '../api';
import type { Event } from '../types';
import EventList from '../components/EventList';
import EventForm from '../components/EventForm';

function formatDateLabel(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function DayView() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formDate, setFormDate] = useState<string | undefined>(undefined);
  const [summary, setSummary] = useState<string | null>(null);
  const [reminder, setReminder] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<'summary' | 'reminder' | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const list = await api.events.list({ date });
      setEvents(list);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [date]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este evento?')) return;
    try {
      await api.events.delete(id);
      load();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditing(null);
    setFormDate(undefined);
    load();
  };

  const openNew = () => {
    setFormDate(date);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (e: Event) => {
    setEditing(e);
    setFormDate(undefined);
    setShowForm(true);
  };

  const prevDay = () => {
    const d = new Date(date + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    setDate(d.toISOString().slice(0, 10));
  };

  const nextDay = () => {
    const d = new Date(date + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    setDate(d.toISOString().slice(0, 10));
  };

  const today = () => setDate(new Date().toISOString().slice(0, 10));

  const fetchSummary = async () => {
    setAiLoading('summary');
    setSummary(null);
    try {
      const res = await api.ollama.summarizeDay(date);
      setSummary(res.summary);
    } catch {
      setSummary('No se pudo obtener el resumen. ¿Está Ollama en marcha?');
    } finally {
      setAiLoading(null);
    }
  };

  const fetchReminder = async () => {
    setAiLoading('reminder');
    setReminder(null);
    try {
      const res = await api.ollama.suggestReminder(undefined, date);
      setReminder(res.reminder);
    } catch {
      setReminder('No se pudo generar el recordatorio. ¿Está Ollama en marcha?');
    } finally {
      setAiLoading(null);
    }
  };

  if (showForm) {
    return (
      <section className="view day-view">
        <EventForm event={editing} defaultDate={formDate} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); setFormDate(undefined); }} />
      </section>
    );
  }

  return (
    <section className="view day-view">
      <header className="view-header">
        <h1>Día</h1>
        <div className="date-nav">
          <button type="button" onClick={prevDay} aria-label="Día anterior">‹</button>
          <button type="button" onClick={today} className="today-btn">Hoy</button>
          <button type="button" onClick={nextDay} aria-label="Día siguiente">›</button>
        </div>
        <p className="date-label">{formatDateLabel(date)}</p>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="date-picker" />
      </header>
      <button type="button" className="btn-primary" onClick={openNew}>Nuevo evento</button>
      <div className="ai-block">
        <h3>Ayuda con IA (Qwen)</h3>
        <div className="ai-actions">
          <button type="button" onClick={fetchSummary} disabled={aiLoading !== null}>
            {aiLoading === 'summary' ? '…' : 'Resumir día'}
          </button>
          <button type="button" onClick={fetchReminder} disabled={aiLoading !== null}>
            {aiLoading === 'reminder' ? '…' : 'Recordatorio sugerido'}
          </button>
        </div>
        {summary && <p className="ai-result summary">{summary}</p>}
        {reminder && <p className="ai-result reminder">{reminder}</p>}
      </div>
      {loading ? <p>Cargando…</p> : <EventList events={events} onEdit={openEdit} onDelete={handleDelete} emptyMessage="No hay eventos este día." />}
    </section>
  );
}
