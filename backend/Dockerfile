# SkyWings Airlines - Application image (Express API + static frontend)
# Build context is the repository root, because server.js serves ../frontend
FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /app

# Install dependencies first so this layer is cached across code changes
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev && npm cache clean --force

# Application code
COPY backend ./backend
COPY frontend ./frontend

# Run as the unprivileged user that ships with the node image
USER node

WORKDIR /app/backend

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1:${PORT:-3000}/api/health || exit 1

CMD ["node", "server.js"]
