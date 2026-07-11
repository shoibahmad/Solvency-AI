# --- Stage 1: Build Frontend ---
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# --- Stage 2: Final Monolith Image ---
FROM python:3.9-slim

WORKDIR /app

# Install Node.js (needed to run Next.js standalone server)
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --upgrade pip && pip install --no-cache-dir -r backend/requirements.txt

# Copy backend source code
COPY backend/ ./backend/

# Set up frontend directory
WORKDIR /app/frontend

# Copy frontend standalone build
COPY --from=frontend-builder /app/frontend/.next/standalone ./
COPY --from=frontend-builder /app/frontend/.next/static ./.next/static
COPY --from=frontend-builder /app/frontend/public ./public

WORKDIR /app

# Copy and prepare startup script
COPY start.sh .
RUN chmod +x start.sh

# Environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Expose Next.js port
EXPOSE 3000

# Start both servers
CMD ["./start.sh"]
