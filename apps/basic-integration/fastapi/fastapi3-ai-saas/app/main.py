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
from app.posthog_logs import configure_posthog_log_exporter, posthog_logs_logger
from app.routers import auth, generate, pages, api_keys, usage, settings as settings_router

settings = get_settings()
templates = Jinja2Templates(directory="app/templates")
logger = logging.getLogger(__name__)


def create_posthog_client() -> Posthog | None:
    """Create the process-wide PostHog client when it is configured."""
    if settings.posthog_project_token and settings.posthog_host:
        return Posthog(
            project_api_key=settings.posthog_project_token,
            host=settings.posthog_host,
            enable_exception_autocapture=True,
            max_retries=0,
            timeout=3,
        )

    if settings.debug:
        if not settings.posthog_project_token:
            logger.warning(
                "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or "
                "un-configured, this causes events to be silently missed. This error "
                "stops appearing once POSTHOG_PROJECT_TOKEN is configured"
            )
        if not settings.posthog_host:
            logger.warning(
                "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing "
                "once POSTHOG_HOST is configured"
            )

    return None


posthog_client = create_posthog_client()
posthog_log_provider = configure_posthog_log_exporter(settings)
if posthog_client:
    atexit.register(posthog_client.shutdown)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    # Initialize database
    init_db()
    if posthog_log_provider:
        posthog_logs_logger.info(
            "application_started",
            extra={"event": "application_started", "component": "fastapi"},
        )

    try:
        yield
    finally:
        if posthog_client:
            try:
                posthog_client.flush()
            except Exception:
                logger.exception("Unable to flush PostHog events during shutdown")
        if posthog_log_provider:
            try:
                posthog_logs_logger.info(
                    "application_stopping",
                    extra={"event": "application_stopping", "component": "fastapi"},
                )
                posthog_log_provider.force_flush(timeout_millis=5000)
            except Exception:
                logger.exception("Unable to flush PostHog logs during shutdown")
            finally:
                try:
                    posthog_log_provider.shutdown(timeout_millis=5000)
                except Exception:
                    logger.exception("Unable to shut down PostHog log export")


app = FastAPI(
    title=settings.app_name,
    description="AI content generation platform",
    lifespan=lifespan,
)
app.state.posthog_client = posthog_client

if posthog_client:
    app.add_middleware(PosthogASGIMiddleware, client=posthog_client)

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
