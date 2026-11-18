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
from app.routers import auth, generate, pages, api_keys, usage, settings as settings_router

settings = get_settings()
logger = logging.getLogger(__name__)
posthog_logs_logger = logging.getLogger("posthog_export")
posthog_logs_logger.setLevel(logging.INFO)
posthog_logs_logger.propagate = False
templates = Jinja2Templates(directory="app/templates")

posthog_client = None
posthog_log_provider = None
if not settings.posthog_project_token:
    if settings.debug:
        logger.warning(
            "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or "
            "un-configured, this causes events to be silently missed. This error "
            "stops appearing once POSTHOG_PROJECT_TOKEN is configured"
        )
if not settings.posthog_host:
    if settings.debug:
        logger.warning(
            "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
            "this causes events to be silently missed. This error stops appearing "
            "once POSTHOG_HOST is configured"
        )
if settings.posthog_project_token and settings.posthog_host:
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    posthog_client = Posthog(
        settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
        timeout=3,
        max_retries=0,
    )
    atexit.register(posthog_client.shutdown)

    posthog_log_provider = LoggerProvider()
    posthog_log_provider.add_log_record_processor(
        BatchLogRecordProcessor(
            OTLPLogExporter(
                endpoint=f"{settings.posthog_host.rstrip('/')}/i/v1/logs",
                headers={"Authorization": f"Bearer {settings.posthog_project_token}"},
            ),
            export_timeout_millis=3000,
        )
    )
    posthog_logs_logger.addHandler(LoggingHandler(logger_provider=posthog_log_provider))


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    # Initialize database
    init_db()
    if posthog_log_provider:
        posthog_logs_logger.info("application_started", extra={"component": "fastapi"})

    yield

    if posthog_client:
        try:
            posthog_client.flush()
        except Exception:
            logger.exception("PostHog event flush failed during shutdown")
    if posthog_log_provider:
        try:
            posthog_log_provider.force_flush(timeout_millis=3000)
            posthog_log_provider.shutdown()
        except Exception:
            logger.exception("PostHog log flush failed during shutdown")


app = FastAPI(
    title=settings.app_name,
    description="AI content generation platform",
    lifespan=lifespan,
)

if posthog_client:
    app.state.posthog_client = posthog_client
    app.add_middleware(PosthogASGIMiddleware, client=posthog_client)
if posthog_log_provider:
    app.state.posthog_log_provider = posthog_log_provider

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
