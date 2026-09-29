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
