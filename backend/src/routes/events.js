import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    let sql = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (from && to) {
      sql += ' AND start_at >= ? AND start_at <= ?';
      params.push(from, to);
    } else if (date) {
      sql += ' AND date(start_at) = date(?)';
      params.push(date);
    }

    sql += ' ORDER BY start_at ASC';
    const events = await db.prepare(sql).all(...params);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const row = await db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, start_at, end_at, type } = req.body;
    if (!title || !start_at) {
      return res.status(400).json({ error: 'Faltan title y start_at' });
    }
    const stmt = db.prepare(`
      INSERT INTO events (title, description, start_at, end_at, type, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `);
    const result = await stmt.run(
      title,
      description || null,
      start_at,
      end_at || null,
      type || 'compromiso'
    );
    const event = await db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, start_at, end_at, type } = req.body;
    const existing = await db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Evento no encontrado' });

    const next = {
      title: title !== undefined ? title : existing.title,
      description: description !== undefined ? description : existing.description,
      start_at: start_at !== undefined ? start_at : existing.start_at,
      end_at: end_at !== undefined ? end_at : existing.end_at,
      type: type !== undefined ? type : existing.type,
    };

    await db.prepare(`
      UPDATE events SET
        title = ?, description = ?, start_at = ?, end_at = ?, type = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).run(next.title, next.description, next.start_at, next.end_at, next.type, req.params.id);

    const event = await db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Evento no encontrado' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
