export interface Event {
  id: number;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string | null;
  type: string;
  created_at: string;
  updated_at: string;
}

export type EventType = 'cita' | 'quedada' | 'compromiso' | 'tarea';
