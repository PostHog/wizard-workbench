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


def initialize_posthog() -> Posthog | None:
    """Create the process-wide PostHog client when it is configured."""
    if not settings.posthog_api_key:
        if settings.debug:
            raise RuntimeError(
                "POSTHOG_API_KEY variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing once "
                "POSTHOG_API_KEY is configured"
            )
        return None

    if not settings.posthog_host:
        if settings.debug:
            raise RuntimeError(
                "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing once "
                "POSTHOG_HOST is configured"
            )
        return None

    posthog_client = Posthog(
        project_api_key=settings.posthog_api_key,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
    return posthog_client


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    app.state.posthog_client = initialize_posthog()
    app.state.posthog_log_provider = configure_posthog_log_exporter(
        settings.posthog_api_key, settings.posthog_host
    )

    # Initialize database
    init_db()

    yield

    if app.state.posthog_log_provider:
        app.state.posthog_log_provider.force_flush()
        app.state.posthog_log_provider.shutdown()

    if app.state.posthog_client:
        app.state.posthog_client.flush()
        app.state.posthog_client.shutdown()


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
    posthog_client = getattr(request.app.state, "posthog_client", None)
    if posthog_client:
        posthog_client.capture_exception(exc)

    if request.url.path.startswith("/api/"):
        return JSONResponse({"error": "Internal server error"}, status_code=500)
    return templates.TemplateResponse(request, "500.html", status_code=500)
