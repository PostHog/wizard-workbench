"""Acme AI - FastAPI SaaS Application."""

import atexit
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from posthog import Posthog

from app.config import get_settings
from app.database import init_db
from app.middleware import PostHogMiddleware
from app.posthog_logs import configure_posthog_log_exporter
from app.routers import auth, generate, pages, api_keys, usage, settings as settings_router

settings = get_settings()
templates = Jinja2Templates(directory="app/templates")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    posthog_client: Posthog | None = None
    if settings.posthog_project_token and settings.posthog_host:
        posthog_client = Posthog(
            settings.posthog_project_token,
            host=settings.posthog_host,
            enable_exception_autocapture=True,
        )
        app.state.posthog = posthog_client
        app.state.posthog_log_provider = configure_posthog_log_exporter(
            settings.posthog_host, settings.posthog_project_token
        )
        atexit.register(posthog_client.shutdown)
    else:
        app.state.posthog = None
        app.state.posthog_log_provider = None
        if settings.debug:
            missing_key = (
                "POSTHOG_PROJECT_TOKEN"
                if not settings.posthog_project_token
                else "POSTHOG_HOST"
            )
            raise RuntimeError(
                f"{missing_key} variable required by PostHog is missing or un-configured, "
                f"this causes events to be silently missed. This error stops appearing once "
                f"{missing_key} is configured"
            )

    # Initialize database
    init_db()

    yield

    log_provider = app.state.posthog_log_provider
    if log_provider:
        log_provider.force_flush()
        log_provider.shutdown()

    if posthog_client:
        posthog_client.flush()
        posthog_client.shutdown()


app = FastAPI(
    title=settings.app_name,
    description="AI content generation platform",
    lifespan=lifespan,
)

app.add_middleware(PostHogMiddleware)

# Include routers
app.include_router(auth.router)
app.include_router(generate.router)
app.include_router(pages.router)
app.include_router(api_keys.router)
app.include_router(usage.router)
app.include_router(settings_router.router)


@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    """Handle 404 errors."""
    if request.url.path.startswith("/api/"):
        return JSONResponse({"error": "Not found"}, status_code=404)
    return templates.TemplateResponse(request, "404.html", status_code=404)


@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    """Capture and handle unhandled server errors."""
    posthog_client: Posthog | None = request.app.state.posthog
    if posthog_client:
        with posthog_client.new_context(fresh=True):
            distinct_id = getattr(request.state, "posthog_distinct_id", None)
            if distinct_id:
                posthog_client.identify_context(distinct_id)
            posthog_client.capture_exception(exc)

    if request.url.path.startswith("/api/"):
        return JSONResponse({"error": "Internal server error"}, status_code=500)
    return templates.TemplateResponse(request, "500.html", status_code=500)
