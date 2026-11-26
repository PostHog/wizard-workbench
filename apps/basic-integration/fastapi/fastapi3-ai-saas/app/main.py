"""Acme AI - FastAPI SaaS Application."""

import atexit
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from posthog import Posthog
from posthog.integrations.asgi import PosthogASGIMiddleware

from app.config import get_settings
from app.database import init_db
from app.routers import auth, generate, pages, api_keys, usage, settings as settings_router

settings = get_settings()
templates = Jinja2Templates(directory="app/templates")
logger = logging.getLogger(__name__)
posthog_logs_logger = logging.getLogger("posthog.exporter")

posthog_client = None
posthog_log_provider = None
if settings.posthog_project_token and settings.posthog_host:
    posthog_client = Posthog(
        settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)

    try:
        posthog_log_provider = LoggerProvider()
        otlp_exporter = OTLPLogExporter(
            endpoint=f"{settings.posthog_host.rstrip('/')}/i/v1/logs",
            headers={
                "Authorization": f"Bearer {settings.posthog_project_token}",
            },
        )
        posthog_log_provider.add_log_record_processor(
            BatchLogRecordProcessor(otlp_exporter)
        )
        posthog_logs_logger.addHandler(
            LoggingHandler(logger_provider=posthog_log_provider)
        )
        posthog_logs_logger.setLevel(logging.INFO)
        posthog_logs_logger.propagate = False
    except Exception:
        logger.warning("PostHog log export setup failed", exc_info=True)
        posthog_log_provider = None
elif settings.debug:
    for variable_name, value in (
        ("POSTHOG_PROJECT_TOKEN", settings.posthog_project_token),
        ("POSTHOG_HOST", settings.posthog_host),
    ):
        if not value:
            logger.warning(
                "%s variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops "
                "appearing once %s is configured",
                variable_name,
                variable_name,
            )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    # Initialize database
    init_db()
    if app.state.posthog_log_provider:
        posthog_logs_logger.info(
            "application_started", extra={"component": "fastapi"}
        )

    yield

    if posthog_client:
        try:
            posthog_client.flush(timeout_seconds=5)
        except Exception:
            logger.warning("PostHog flush failed during shutdown", exc_info=True)

    if app.state.posthog_log_provider:
        try:
            app.state.posthog_log_provider.force_flush(timeout_millis=5000)
            app.state.posthog_log_provider.shutdown(timeout_millis=5000)
        except Exception:
            logger.warning("PostHog log export shutdown failed", exc_info=True)


app = FastAPI(
    title=settings.app_name,
    description="AI content generation platform",
    lifespan=lifespan,
)
app.state.posthog = posthog_client
app.state.posthog_log_provider = posthog_log_provider

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
