# ============================================================================
#  Dockerfile Multi-Stage — Angular + nginx
#  Etapa 1: Build cu Node.js
#  Etapa 2: Servire cu nginx (imagine minima, non-root)
# ============================================================================

# ── Build ────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npx ng build --configuration production

# ── Runtime ──────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

LABEL org.opencontainers.image.title="Student Portal Angular" \
      org.opencontainers.image.description="Portal studenti Angular servit cu nginx"

# Copiere configurare nginx customizata
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Copiere artefacte Angular din etapa de build
COPY --from=builder /app/dist/student-portal/browser /usr/share/nginx/html

# Securitate: permisiuni corecte
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Port configurabil — Render seteaza $PORT automat (default 8080 local)
ENV PORT=8080

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:${PORT}/ || exit 1

# La start: inlocuieste $PORT in template → genereaza config → porneste nginx
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
