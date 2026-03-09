const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen';

/**
 * Llama al endpoint /api/chat de Ollama con el modelo configurado.
 * @param {Array<{role: string, content: string}>} messages
 * @param {boolean} stream
 * @returns {Promise<{content?: string, done?: boolean, error?: string}>}
 */
export async function chat(messages, stream = false) {
  const url = `${OLLAMA_HOST.replace(/\/$/, '')}/api/chat`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama error ${res.status}: ${text}`);
  }
  if (stream) return res.body;
  return res.json();
}

/**
 * Comprueba que Ollama esté disponible y el modelo listado.
 * @returns {Promise<{ok: boolean, models?: string[], error?: string}>}
 */
export async function healthCheck() {
  try {
    const url = `${OLLAMA_HOST.replace(/\/$/, '')}/api/tags`;
    const res = await fetch(url);
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    const models = (data.models || []).map((m) => m.name);
    return { ok: true, models };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export { OLLAMA_HOST, OLLAMA_MODEL };
