import { Router } from 'express';
import db from '../db.js';

const router = Router();

/**
 * Lista eventos que tienen start_at en el futuro (próximos X horas o días).
 * Útil para que la PWA muestre "recordatorios pendientes" sin necesidad de push.
 */
router.get('/pending', async (req, res) => {
  try {
    const hours = Math.min(24 * 7, Math.max(0, Number(req.query.hours) || 24));
    const now = new Date().toISOString();
    const limit = new Date();
    limit.setHours(limit.getHours() + hours);

    const events = await db.prepare(`
      SELECT id, title, description, start_at, end_at, type
      FROM events
      WHERE start_at > ?
        AND start_at <= ?
      ORDER BY start_at ASC
    `).all(now, limit.toISOString());

    res.json({ events, from: now, to: limit.toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
