import { useState, useEffect } from 'react';
import { api } from '../api';
import type { Event } from '../types';
import EventList from '../components/EventList';
import EventForm from '../components/EventForm';

function getWeekRange(baseDate: string): { from: string; to: string } {
  const d = new Date(baseDate + 'T12:00:00');
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    from: monday.toISOString().slice(0, 10),
    to: sunday.toISOString().slice(0, 10),
  };
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function WeekView() {
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    return monday.toISOString().slice(0, 10);
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formDate, setFormDate] = useState<string | undefined>(undefined);

  const { from, to } = getWeekRange(weekStart);

  const load = async () => {
    setLoading(true);
    try {
      const list = await api.events.list({ from, to });
      setEvents(list);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [from, to]);

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

  const openNew = (date?: string) => {
    setFormDate(date || weekStart);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (e: Event) => {
    setEditing(e);
    setFormDate(undefined);
    setShowForm(true);
  };

  const prevWeek = () => {
    const d = new Date(weekStart + 'T12:00:00');
    d.setDate(d.getDate() - 7);
    setWeekStart(d.toISOString().slice(0, 10));
  };

  const nextWeek = () => {
    const d = new Date(weekStart + 'T12:00:00');
    d.setDate(d.getDate() + 7);
    setWeekStart(d.toISOString().slice(0, 10));
  };

  if (showForm) {
    return (
      <section className="view week-view">
        <EventForm event={editing} defaultDate={formDate} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); setFormDate(undefined); }} />
      </section>
    );
  }

  const eventsByDate: Record<string, Event[]> = {};
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(from + 'T12:00:00');
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    days.push(key);
    eventsByDate[key] = events.filter((e) => e.start_at.startsWith(key));
  }

  return (
    <section className="view week-view">
      <header className="view-header">
        <h1>Semana</h1>
        <div className="date-nav">
          <button type="button" onClick={prevWeek} aria-label="Semana anterior">‹</button>
          <span className="week-range">{formatShortDate(from)} – {formatShortDate(to)}</span>
          <button type="button" onClick={nextWeek} aria-label="Semana siguiente">›</button>
        </div>
      </header>
      <button type="button" className="btn-primary" onClick={() => openNew()}>Nuevo evento</button>
      {loading ? (
        <p>Cargando…</p>
      ) : (
        <div className="week-grid">
          {days.map((day) => (
            <div key={day} className="week-day">
              <h3>{formatShortDate(day)}</h3>
              <EventList
                events={eventsByDate[day] || []}
                onEdit={openEdit}
                onDelete={handleDelete}
                emptyMessage="Sin eventos"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
