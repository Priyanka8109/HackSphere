# ==================================================
# HackSphere Backend Dockerfile (Experiment 7)
# ==================================================
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency manifests first for optimal Docker layer caching
COPY package*.json ./

# Install production and required dependencies
RUN npm ci --omit=dev

# Copy backend application source code
COPY . .

# Expose backend API port
EXPOSE 5000

# Set production environment default
ENV NODE_ENV=production
ENV PORT=5000

# Start Express server
CMD ["node", "server.js"]
