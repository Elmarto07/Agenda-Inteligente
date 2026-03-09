import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import eventsRouter from './routes/events.js';
import ollamaRouter from './routes/ollama.js';
import remindersRouter from './routes/reminders.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/events', eventsRouter);
app.use('/api/ollama', ollamaRouter);
app.use('/api/reminders', remindersRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'agenda-inteligente-api' });
});

app.listen(PORT, () => {
  console.log(`Agenda Inteligente API en http://localhost:${PORT}`);
});
