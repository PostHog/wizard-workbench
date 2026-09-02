# syntax=docker/dockerfile:1

# Single-stage build: install dependencies, compile TypeScript, and run the app
# all from one image. Simpler than a multi-stage build, at the cost of a larger
# final image (dev dependencies and source files stay in the layers).
FROM node:22-slim
WORKDIR /app

# Install all dependencies (including dev deps such as typescript) using the lockfile.
COPY package.json package-lock.json ./
RUN npm ci

# Compile src/ -> dist/
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

ENV NODE_ENV=production

# POSTHOG_KEY / POSTHOG_HOST are provided at runtime (e.g. `docker run -e ...`).
CMD ["node", "dist/index.js"]
