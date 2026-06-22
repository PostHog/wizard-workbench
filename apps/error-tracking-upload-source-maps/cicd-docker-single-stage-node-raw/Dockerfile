# syntax=docker/dockerfile:1

# ---- Single stage ----
# Build and runtime share one stage. The image is built and run by hand
# (`docker build` / `docker run`) — this project has no CI pipeline.
#
# Because there is no separate build stage to throw away, plain ARG/ENV for the
# API key would bake it into the shipped image (`docker history` can reveal build
# args; `docker inspect` reveals ENV). Instead the key is mounted as a BuildKit
# secret on the build RUN: it exists for that one command and is never written to
# a layer. The non-secret project id and host stay as ordinary build args.
FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app

# Install all dependencies (including dev deps such as typescript and @posthog/cli)
# using the lockfile.
COPY package.json package-lock.json ./
RUN npm ci

# Compile src/ -> dist/, then inject + upload source maps to PostHog.
COPY tsconfig.json ./
COPY src ./src

# Non-secret upload credentials are plain build args promoted to env vars so
# posthog-cli can read them. (POSTHOG_CLI_API_KEY is intentionally NOT here.)
ARG POSTHOG_CLI_PROJECT_ID
ARG POSTHOG_CLI_HOST
ENV POSTHOG_CLI_PROJECT_ID=$POSTHOG_CLI_PROJECT_ID \
    POSTHOG_CLI_HOST=$POSTHOG_CLI_HOST

# The personal API key is mounted as a BuildKit secret: `env=` exposes it to this
# RUN as $POSTHOG_CLI_API_KEY without ever writing it to an image layer.
RUN --mount=type=secret,id=POSTHOG_CLI_API_KEY,env=POSTHOG_CLI_API_KEY \
    npm run build

# POSTHOG_KEY / POSTHOG_HOST are provided at runtime (e.g. `docker run -e ...`).
CMD ["node", "dist/index.js"]
