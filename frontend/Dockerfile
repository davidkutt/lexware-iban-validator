# Multi-Stage Build
FROM node:18-alpine as builder

WORKDIR /app

# Package files kopieren
COPY package*.json ./

# Dependencies installieren
RUN npm ci

# Source kopieren
COPY . .

# Build
RUN npm run build

# Production Stage
FROM nginx:alpine

# Nginx Konfiguration
COPY nginx.conf /etc/nginx/nginx.conf

# Build-Artefakte kopieren
COPY --from=builder /app/dist /usr/share/nginx/html

# Health Check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
