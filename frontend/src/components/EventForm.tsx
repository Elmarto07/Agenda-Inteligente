import { useState, useEffect } from 'react';
import type { Event } from '../types';

interface EventFormProps {
  event?: Event | null;
  defaultDate?: string;
  onSave: () => void;
  onCancel: () => void;
}

const TYPES = [
  { value: 'cita', label: 'Cita' },
  { value: 'quedada', label: 'Quedada' },
  { value: 'compromiso', label: 'Compromiso' },
  { value: 'tarea', label: 'Tarea' },
];

function toLocalDateTime(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day}T${h}:${min}`;
}

function toISO(dateStr: string, timeStr: string): string {
  return new Date(`${dateStr}T${timeStr}`).toISOString();
}

export default function EventForm({ event, defaultDate, onSave, onCancel }: EventFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(defaultDate || today);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('');
  const [type, setType] = useState('compromiso');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      const start = toLocalDateTime(event.start_at);
      setDate(start.slice(0, 10));
      setStartTime(start.slice(11, 16));
      setEndTime(event.end_at ? toLocalDateTime(event.end_at).slice(11, 16) : '');
      setType(event.type || 'compromiso');
    } else if (defaultDate) {
      setDate(defaultDate);
    }
  }, [event, defaultDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const start_at = toISO(date, startTime);
      const end_at = endTime ? toISO(date, endTime) : undefined;
      if (event) {
        await import('../api').then(({ api }) => api.events.update(event.id, { title, description: description || undefined, start_at, end_at, type }));
      } else {
        await import('../api').then(({ api }) => api.events.create({ title, description: description || undefined, start_at, end_at, type }));
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h2>{event ? 'Editar evento' : 'Nuevo evento'}</h2>
      {error && <p className="form-error">{error}</p>}
      <label>
        Título *
        <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ej. Reunión con Juan" />
      </label>
      <label>
        Descripción
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Detalles opcionales" />
      </label>
      <label>
        Tipo
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </label>
      <label>
        Fecha *
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>
      <div className="row">
        <label>
          Hora inicio *
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </label>
        <label>
          Hora fin
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </label>
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel}>Cancelar</button>
        <button type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
      </div>
    </form>
  );
}
