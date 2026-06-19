# syntax=docker/dockerfile:1

# Builds the backend (and its workspace dependencies) from the pnpm monorepo
# root. The build context is the repository root so that pnpm-workspace.yaml,
# the lockfile and the shared package are all available. The React/Vite
# frontend is intentionally excluded (see .dockerignore).

# ---- Build stage ----
FROM node:22-slim AS build
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /repo

# Install only what the `backend` workspace needs (plus its workspace deps)
# using the frozen lockfile. Copying just the manifests first keeps this layer
# cached until a package.json actually changes.
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared/package.json packages/shared/
COPY backend/package.json backend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter backend...

# Compile the sources. Shared is built before the backend so its dist/ + types
# are in place. tsc emits source maps that posthog-cli then injects and uploads.
COPY packages/shared packages/shared
COPY backend backend
ARG POSTHOG_CLI_API_KEY
ARG POSTHOG_CLI_PROJECT_ID
ARG POSTHOG_CLI_HOST
ENV POSTHOG_CLI_API_KEY=$POSTHOG_CLI_API_KEY \
    POSTHOG_CLI_PROJECT_ID=$POSTHOG_CLI_PROJECT_ID \
    POSTHOG_CLI_HOST=$POSTHOG_CLI_HOST
RUN pnpm --filter @repo/shared build && pnpm --filter backend build

# ---- Runtime stage ----
# Reinstall production-only dependencies and copy in the compiled output. The
# prod install recreates the backend -> @repo/shared workspace symlink, so we
# just drop the built dist/ folders into place.
FROM node:22-slim AS runtime
ENV NODE_ENV=production
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /repo

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared/package.json packages/shared/
COPY backend/package.json backend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod --filter backend...

COPY --from=build /repo/packages/shared/dist packages/shared/dist
COPY --from=build /repo/backend/dist backend/dist

WORKDIR /repo/backend
# POSTHOG_KEY / POSTHOG_HOST are provided at runtime (e.g. `docker run -e ...`).
CMD ["node", "dist/index.js"]
