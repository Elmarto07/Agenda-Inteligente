import { Router } from 'express';
import { healthCheck, chat } from '../ollamaClient.js';
import db from '../db.js';

const router = Router();

router.get('/health', async (_req, res) => {
  try {
    const result = await healthCheck();
    res.json(result);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post('/summarize-day', async (req, res) => {
  try {
    const date = req.body?.date || new Date().toISOString().slice(0, 10);
    const events = await db.prepare(
      "SELECT title, description, start_at, end_at, type FROM events WHERE date(start_at) = date(?) ORDER BY start_at"
    ).all(date);

    const list = events.length
      ? events.map((e) => `- ${e.title} (${e.start_at}${e.end_at ? ' - ' + e.end_at : ''}) ${e.description ? ': ' + e.description : ''}`).join('\n')
      : 'No hay eventos.';

    const messages = [
      {
        role: 'system',
        content: 'Eres un asistente que ayuda a organizar la agenda. Responde en español de forma breve y clara.',
      },
      {
        role: 'user',
        content: `Resume el día ${date} en una o dos frases. Eventos:\n${list}`,
      },
    ];

    const result = await chat(messages);
    const text = result.message?.content || result.content || 'Sin resumen.';
    res.json({ date, summary: text.trim(), events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/suggest-reminder', async (req, res) => {
  try {
    const { eventId, date } = req.body;
    let events = [];

    if (eventId) {
      const event = await db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
      if (!event) return res.status(404).json({ error: 'Evento no encontrado' });
      events = [event];
    } else {
      const d = date || new Date().toISOString().slice(0, 10);
      events = await db.prepare(
        "SELECT * FROM events WHERE date(start_at) = date(?) ORDER BY start_at"
      ).all(d);
    }

    const list = events.map((e) => `${e.title} a las ${e.start_at}${e.description ? ' - ' + e.description : ''}`).join('\n');

    const messages = [
      {
        role: 'system',
        content: 'Eres un asistente que redacta recordatorios amigables para la agenda. Una sola frase corta por evento, en español.',
      },
      {
        role: 'user',
        content: `Redacta un recordatorio breve para estos compromisos:\n${list}`,
      },
    ];

    const result = await chat(messages);
    const text = result.message?.content || result.content || list;
    res.json({ reminder: text.trim(), events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/suggest-organization', async (req, res) => {
  try {
    const { tasks } = req.body;
    const text = Array.isArray(tasks) ? tasks.join('\n') : (tasks || 'Nada');

    const messages = [
      {
        role: 'system',
        content: 'Eres un asistente que ayuda a organizar tareas. Sugiere un orden o bloques de tiempo (mañana, tarde). Responde en español, breve.',
      },
      {
        role: 'user',
        content: `Tengo que hacer esta semana:\n${text}\n\nSugiere en qué orden o cuándo hacerlas.`,
      },
    ];

    const result = await chat(messages);
    const suggestion = result.message?.content || result.content || 'Sin sugerencia.';
    res.json({ suggestion: suggestion.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
