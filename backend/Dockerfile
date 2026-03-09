# Backend Agenda Inteligente para Fly.io (Bun + SQLite)
FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json ./
RUN bun install
COPY . .

# Fly.io asigna PORT; por defecto 3001 en local
ENV PORT=3001
EXPOSE 3001

CMD ["bun", "run", "start"]
