/**
 * Capa de base de datos: SQLite local (Bun) o Turso (nube, gratis).
 * Si existen TURSO_DATABASE_URL y TURSO_AUTH_TOKEN se usa Turso; si no, SQLite local.
 */
const useTurso = process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN;

let db;

if (useTurso) {
  const { createClient } = await import('@libsql/client');
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const runSchema = async () => {
    const schema = `
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        start_at TEXT NOT NULL,
        end_at TEXT,
        type TEXT NOT NULL DEFAULT 'compromiso',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        remind_at TEXT NOT NULL,
        sent INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_events_start ON events(start_at);
      CREATE INDEX IF NOT EXISTS idx_reminders_event ON reminders(event_id);
      CREATE INDEX IF NOT EXISTS idx_reminders_sent ON reminders(sent);
    `;
    for (const sql of schema.trim().split(';').filter(Boolean)) {
      await client.execute(sql.trim() + ';');
    }
  };
  await runSchema();

  const rowToObj = (row) => (row && typeof row === 'object' ? { ...row } : row);

  db = {
    prepare(sql) {
      return {
        async all(...args) {
          const r = await client.execute({ sql, args });
          return (r.rows || []).map(rowToObj);
        },
        async get(...args) {
          const r = await client.execute({ sql, args });
          const row = r.rows?.[0];
          return row == null ? undefined : rowToObj(row);
        },
        async run(...args) {
          const r = await client.execute({ sql, args });
          return {
            lastInsertRowid: r.lastInsertRowid != null ? Number(r.lastInsertRowid) : 0,
            changes: r.rowsAffected ?? 0,
          };
        },
      };
    },
  };
} else {
  const { Database } = await import('bun:sqlite');
  const { join } = await import('path');
  const dbPath = process.env.SQLITE_PATH || join(import.meta.dir, '..', 'agenda.db');
  const sqlite = new Database(dbPath);

  const schema = `
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      start_at TEXT NOT NULL,
      end_at TEXT,
      type TEXT NOT NULL DEFAULT 'compromiso',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      remind_at TEXT NOT NULL,
      sent INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_events_start ON events(start_at);
    CREATE INDEX IF NOT EXISTS idx_reminders_event ON reminders(event_id);
    CREATE INDEX IF NOT EXISTS idx_reminders_sent ON reminders(sent);
  `;
  schema.trim().split(';').filter(Boolean).forEach((s) => sqlite.run(s.trim() + ';'));

  db = {
    prepare(sql) {
      const stmt = sqlite.query(sql);
      return {
        all(...params) { return Promise.resolve(stmt.all(...params)); },
        get(...params) { return Promise.resolve(stmt.get(...params)); },
        run(...params) { return Promise.resolve(stmt.run(...params)); },
      };
    },
  };
}

export default db;
