import type { Event } from '../types';

interface EventListProps {
  events: Event[];
  onEdit: (e: Event) => void;
  onDelete: (id: number) => void;
  emptyMessage?: string;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function formatRange(start: string, end: string | null): string {
  if (!end) return formatTime(start);
  return `${formatTime(start)} – ${formatTime(end)}`;
}

export default function EventList({ events, onEdit, onDelete, emptyMessage }: EventListProps) {
  if (events.length === 0) {
    return <p className="event-list-empty">{emptyMessage || 'No hay eventos.'}</p>;
  }

  return (
    <ul className="event-list">
      {events.map((e) => (
        <li key={e.id} className="event-item" data-type={e.type}>
          <div className="event-item-main">
            <span className="event-time">{formatRange(e.start_at, e.end_at)}</span>
            <strong className="event-title">{e.title}</strong>
            {e.description && <span className="event-desc">{e.description}</span>}
          </div>
          <div className="event-item-actions">
            <button type="button" onClick={() => onEdit(e)} aria-label="Editar">Editar</button>
            <button type="button" onClick={() => onDelete(e.id)} className="danger" aria-label="Eliminar">Eliminar</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
