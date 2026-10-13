# Error tracking test apps

Fixtures for `wizard error-tracking`. On every supported app the run is expected to:

- install and initialize the PostHog SDK first when the app doesn't have it (the flow's seed queues install/init like `wizard replay-vision` does)
- wire up exception capture through the SDK's own mechanism (autocapture at init, the framework's error handler, or an error boundary at the app entry) — in one place, never sprinkled manual capture calls
- on platforms that ship minified bundles or stripped binaries, wire source-map / debug-symbol upload into the production build, credentials and CI included
- on Python, Ruby and PHP, link each production deploy to a release: resolve it in the deploy job only and get its ID into the running app as `POSTHOG_RELEASE_ID`, with local runs, tests and pull-request builds left as they are (the `cicd-*-python-*`, `cicd-*-ruby-*` and `cicd-*-php-*` apps)
- write the run report to `./posthog-error-tracking-report.md`

Each app's README lists only what is specific to it.

## Release linking apps

Python, Ruby and PHP ship readable stack traces, so these apps grade release linking instead of source-map upload. Their own READMEs describe the project only, because the agent reads them; the expectations live here.

**`cicd-github-actions-docker-python-flask`**: Flask without PostHog. `deploy.yml` builds a multi-stage image, pushes it to GHCR, and replaces the container over SSH with `docker run`; `ci.yml` tests pull requests and pushes. Expected:

- `posthog` at 7.59.0 or later in `requirements.txt`, even when the local interpreter is too old to install it (the image runs Python 3.12)
- `PostHog/resolve-release@v1` in `deploy.yml` only, before the image ships, with `continue-on-error`
- the ID reaches the container as `POSTHOG_RELEASE_ID`: `ARG` + `ENV` in the **final** Dockerfile stage fed by `build-args`, or `-e` on `docker run`
- the `docker run` also passes the app's PostHog token and host, by the names the init reads
- `ci.yml`, `bin/dev`, `.env` and `.env.example` carry no release ID

**`cicd-gitlab-ruby-sinatra`**: Sinatra + Puma that already uses PostHog (`lib/analytics.rb`) on `posthog-ruby` 3.20.0. The GitLab `deploy` job runs on `ruby:3.3-slim` and SSHes into the server to restart a systemd unit that reads `/srv/inventory/shared/inventory.env`. Expected:

- the existing init kept, and `posthog-ruby` at 3.25.0 or later in `Gemfile.lock`
- `posthog-cli release resolve` in the `deploy` job only, with the CLI installed in the job (the slim image has no `curl` or Node), and a failed resolve never failing the deploy
- `POSTHOG_RELEASE_ID` written into the unit's `EnvironmentFile` on the server, replacing any previous value, before `systemctl restart`
- the `test` job, `bin/dev`, `.env` and `.env.example` carry no release ID

**`cicd-github-actions-docker-php-laravel`**: Laravel 12 without PostHog on a `php:8.4-fpm-alpine` image. `deploy.yml` pushes the image and rolls out `docker-compose.prod.yml` over SSH; the entrypoint runs `config:cache`, and `docker/php-fpm/zz-app.conf` sets `clear_env = yes`. Expected:

- `posthog/posthog-php` at 4.14.0 or later
- `PostHog/resolve-release@v1` in `deploy.yml` only, with `continue-on-error`
- the ID reaches the container (`build-args` + `ARG`/`ENV` in the final stage, or `environment:` in the compose file fed from the SSH script)
- `env[POSTHOG_RELEASE_ID] = $POSTHOG_RELEASE_ID` in `docker/php-fpm/zz-app.conf`; without it the workers never see the ID
- `tests.yml`, `composer dev`, `.env` and `.env.example` carry no release ID

## Stack-specific apps

Each of these apps has a setup that a generic integration gets wrong. As with the release-linking apps, their own READMEs describe the project only.

**`no-posthog-nestjs`**: NestJS 11 without PostHog. The global `AllExceptionsFilter` (`@Catch()`) turns every exception into a JSON response, config comes from `@nestjs/config`, and the Dockerfile runs `nest build` and then `npm prune --omit=dev`. Expected:

- capture inside `AllExceptionsFilter.catch` for server errors, not `HttpException` 4xx responses, with the JSON error shape kept
- the client created once `ConfigModule` has loaded `.env`, not from `process.env` at module top level
- the upload runs on the build that ships, inside the Docker build and before the prune, with the key passed as a build secret, never a build arg

**`no-posthog-express-tsc`**: Express 5 in TypeScript with native ES modules (`NodeNext`, `verbatimModuleSyntax`), compiled by `tsc` with source maps off. Nothing loads `.env`. Render builds and serves it from `render.yaml`; the build in `ci.yml` never ships. Expected:

- `sourceMap: true` in `tsconfig.json`, which keeps `"types": ["node"]`
- capture in the final error middleware in `src/server.ts`, with `.js` extensions on new imports
- the upload in Render's `buildCommand`, its variables declared as Render env vars, not only as GitHub secrets
- the missing `.env` loader named as a follow-up

**`no-posthog-cloudflare-worker`**: Hono on Cloudflare Workers without PostHog. `cloudflare/wrangler-action` deploys with `wrangler deploy --minify`, while `npm run build` bundles without `--minify`. Expected:

- the client built from `c.env` bindings typed in `src/types.ts`, never `process.env`
- capture in `app.onError` for errors other than `HTTPException`, sent through `c.executionCtx.waitUntil`, with the handler still returning a response
- maps uploaded from the same minified bundle that deploys; `upload_source_maps` in `wrangler.toml` is Cloudflare's own feature, not the PostHog upload

**`no-posthog-electron`**: Electron 44 with electron-vite and electron-builder, without PostHog. The main, preload and renderer sections build separately, the renderer's CSP allows only `'self'`, and the release job builds on three OS runners. Expected:

- `posthog-node` in `dependencies` for the main process and `posthog-js` in the renderer, each process with its own client and none shared over `contextBridge`
- the main-process token read as `import.meta.env.MAIN_VITE_*`, which electron-vite inlines at build, because a packaged app has no `.env`
- the renderer's CSP `connect-src` allows the PostHog host
- source maps set per section in `electron.vite.config.ts` and kept out of the packaged app

**`no-posthog-fastapi-uv`**: FastAPI managed only by uv (`uv.lock`, `uv sync --locked`), src layout with the package `app`, deployed to Fly from GitHub Actions. Expected:

- `posthog` added with `uv add`, so `pyproject.toml` and `uv.lock` change together, with no `requirements.txt` or `pip install`
- capture in the existing `Exception` handler only, not also in a middleware, and not for `HTTPException`
- release linking in `deploy.yml` only, with the ID reaching the app as `POSTHOG_RELEASE_ID`
- the runtime key named as a Fly secret, never a Docker build arg

**`no-posthog-spring-boot`**: Spring Boot 3.5 on Java 17, Gradle Kotlin DSL and `application.yml`. A `@RestControllerAdvice` turns every exception into a 500, so nothing reaches `/error` or a filter. Expected:

- capture in the advice's `Exception` handler, not in the `ResponseStatusException` handler or a filter
- the key read from the environment with an empty default (`${POSTHOG_API_KEY:}`), so `./gradlew build` and its `@SpringBootTest` pass with no environment
- one client bean, closed on shutdown, and no upload or release linking
- the Boot and Gradle versions unchanged

**`create-react-app`**: Create React App 5 (`react-scripts`, no webpack config) with `posthog-js` initialized in `src/index.js`, deployed to Netlify from GitHub Actions. Expected:

- no `eject`, craco or react-app-rewired: the upload runs on `build/` after `react-scripts build`, in a step that covers both the workflow and Netlify's own builds
- `GENERATE_SOURCEMAP` left on, and the maps deleted after upload so Netlify does not publish them
- the `CI=true` build passes with only environment variables and no `.env`
- the personal API key never gets a `REACT_APP_` prefix

**`next-sentry`**: Next.js 15 with `@sentry/nextjs` 11 set up the documented way, `productionBrowserSourceMaps: true`, and `posthog-js` pinned exactly to 1.274.1 and initialized after `Sentry.init`. Expected:

- Sentry left working: no second `Sentry.init`, and PostHog composed into the existing `onRequestError` export and `global-error.tsx`
- `productionBrowserSourceMaps` kept
- `posthog-js` kept as an exact pin, upgraded only when the install fails on it
- no `posthog-node` in the edge runtime (`middleware.ts`, `app/api/edge/route.ts`)

**`vite-yarn-pnp`**: Vite and React on Yarn 4 Plug'n'Play, with no `node_modules` and a one-day `npmMinimalAgeGate`. `posthog-js` runs through `PostHogProvider` with `VITE_PH_PROJECT_TOKEN`. The build emits hidden source maps and `.gz` and `.br` copies, and the GitHub Pages workflow publishes all of `dist/`. Expected:

- packages added with `yarn add`, so `.pnp.cjs` and `yarn.lock` change together, never with npm or a switch to `nodeLinker: node-modules`
- the existing `VITE_PH_*` names reused, and the personal API key never given a `VITE_` prefix
- the maps uploaded and then deleted before `upload-pages-artifact`
