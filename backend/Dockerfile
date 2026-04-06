# ─── STAGE 1: INSTALLER ───
FROM node:20-alpine AS installer
WORKDIR /app

# Install build tools needed only for the installation phase
RUN apk add --no-cache python3 make g++ 

# Copy package files and install ALL dependencies
COPY package.json package-lock.json ./
RUN npm ci

# ─── STAGE 2: RUNNER (Final Image) ───
FROM node:20-alpine AS runner
WORKDIR /app

# Only install the light docker-cli (needed for your project's executor)
RUN apk add --no-cache docker-cli

# Copy the pre-installed node_modules from the installer stage
COPY --from=installer /app/node_modules ./node_modules

# Copy source code and config files
COPY tsconfig.json ./
COPY src/ ./src/
COPY types/ ./types/
COPY package.json ./

# Ensure submissions directory exists
RUN mkdir -p /app/submissions

EXPOSE 5000

# Default command (used by the API container)
CMD ["npx", "tsx", "src/server.ts"]
