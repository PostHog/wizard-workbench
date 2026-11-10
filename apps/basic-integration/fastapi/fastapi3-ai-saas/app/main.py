"""Acme AI - FastAPI SaaS Application."""

import atexit
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from posthog import Posthog
from posthog.integrations.asgi import PosthogASGIMiddleware

from app.config import get_settings
from app.database import init_db
from app.logs import configure_posthog_logs, posthog_log_logger

logger = logging.getLogger(__name__)
settings = get_settings()
templates = Jinja2Templates(directory="app/templates")
posthog_client: Posthog | None = None
posthog_log_provider = None

if settings.posthog_project_token and settings.posthog_host:
    posthog_client = Posthog(
        project_api_key=settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    posthog_log_provider = configure_posthog_logs(
        settings.posthog_project_token, settings.posthog_host
    )
    atexit.register(posthog_client.shutdown)
elif settings.debug:
    if not settings.posthog_project_token:
        logger.warning(
            "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, "
            "this causes events to be silently missed. This error stops appearing once "
            "POSTHOG_PROJECT_TOKEN is configured"
        )
    if not settings.posthog_host:
        logger.warning(
            "POSTHOG_HOST variable required by PostHog is missing or un-configured, this "
            "causes events to be silently missed. This error stops appearing once "
            "POSTHOG_HOST is configured"
        )

from app.routers import auth, generate, pages, api_keys, usage, settings as settings_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    # Initialize database
    init_db()
    if posthog_log_provider:
        posthog_log_logger.info(
            "application_started",
            extra={"event": "application_started", "component": "api"},
        )

    yield

    if posthog_client:
        try:
            posthog_client.flush()
        except Exception:
            logger.exception("Failed to flush PostHog events during shutdown")
    if posthog_log_provider:
        try:
            posthog_log_provider.force_flush(timeout_millis=3000)
        except Exception:
            logger.exception("Failed to flush PostHog logs during shutdown")
        try:
            posthog_log_provider.shutdown()
        except Exception:
            logger.exception("Failed to shut down the PostHog log exporter")


app = FastAPI(
    title=settings.app_name,
    description="AI content generation platform",
    lifespan=lifespan,
)

if posthog_client:
    app.add_middleware(PosthogASGIMiddleware, posthog_client=posthog_client)

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
    """Handle 500 errors."""
    if request.url.path.startswith("/api/"):
        return JSONResponse({"error": "Internal server error"}, status_code=500)
    return templates.TemplateResponse(request, "500.html", status_code=500)
