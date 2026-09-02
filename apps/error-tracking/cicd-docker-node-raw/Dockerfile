# syntax=docker/dockerfile:1

# ---- Build stage ----
# Compiles the TypeScript app into dist/. The image is built and run by hand
# (`docker build` / `docker run`) — this project has no CI pipeline.
FROM node:22-slim AS build
WORKDIR /app

# Install all dependencies (including dev deps such as typescript) using the lockfile.
COPY package.json package-lock.json ./
RUN npm ci

# Compile src/ -> dist/
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Runtime stage ----
# Ships only production dependencies and the compiled output.
FROM node:22-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

# POSTHOG_KEY / POSTHOG_HOST are provided at runtime (e.g. `docker run -e ...`).
CMD ["node", "dist/index.js"]
