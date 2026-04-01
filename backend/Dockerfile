FROM node:20-alpine

WORKDIR /app

# Install dependencies needed for node-gyp or similar if any, AND docker-cli for executor
RUN apk add --no-cache python3 make g++ docker-cli

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code and config files
COPY tsconfig.json ./
COPY src/ ./src/
COPY types/ ./types/

# Ensure submissions directory exists
RUN mkdir -p /app/submissions

EXPOSE 5000

# Default command (used by the API container)
CMD ["npx", "tsx", "src/server.ts"]

