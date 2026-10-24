# ==================================================
# HackSphere Frontend Dockerfile (Experiment 7)
# Multi-stage build: Vite build -> Nginx production
# ==================================================

# --------------------------------------------------
# Stage 1: Build React/Vite application
# --------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies required for Vite build)
RUN npm ci

# Copy application source code and configs
COPY . .

# Build argument for API base URL (defaults to empty string for relative Nginx reverse proxy)
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
# Build argument for Socket.IO URL (frontend connects to backend)
ARG REACT_APP_SOCKET_URL=""
ENV REACT_APP_SOCKET_URL=$REACT_APP_SOCKET_URL

# Build production bundle into /app/dist
RUN npm run build

# --------------------------------------------------
# Stage 2: Serve production bundle using Nginx
# --------------------------------------------------
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with SPA fallback and API reverse proxy
COPY nginx.conf /etc/nginx/nginx.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
