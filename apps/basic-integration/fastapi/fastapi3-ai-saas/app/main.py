"""Acme AI - FastAPI SaaS Application."""

import atexit
import logging
from contextlib import asynccontextmanager
from typing import Optional

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
posthog_log_logger = logging.getLogger("app.posthog_logs")
posthog_log_logger.setLevel(logging.INFO)
posthog_log_logger.propagate = False

posthog_client: Optional[Posthog] = None
posthog_log_provider: Optional[LoggerProvider] = None
if settings.posthog_api_key and settings.posthog_host:
    posthog_client = Posthog(
        settings.posthog_api_key,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)

    posthog_log_provider = LoggerProvider()
    posthog_log_exporter = OTLPLogExporter(
        endpoint=f"{settings.posthog_host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {settings.posthog_api_key}"},
    )
    posthog_log_provider.add_log_record_processor(
        BatchLogRecordProcessor(posthog_log_exporter)
    )
    posthog_log_logger.addHandler(
        LoggingHandler(logger_provider=posthog_log_provider)
    )
elif settings.debug:
    missing_variable = (
        "POSTHOG_API_KEY" if not settings.posthog_api_key else "POSTHOG_HOST"
    )
    logger.warning(
        "%s variable required by PostHog is missing or un-configured, this causes "
        "events to be silently missed. This error stops appearing once %s is configured",
        missing_variable,
        missing_variable,
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    # Initialize database
    init_db()

    yield

    if posthog_client:
        try:
            posthog_client.flush(timeout_seconds=5)
        except Exception:
            logger.warning("PostHog flush failed during shutdown", exc_info=True)

    if posthog_log_provider:
        try:
            posthog_log_provider.force_flush(timeout_millis=5000)
        except Exception:
            logger.warning("PostHog log flush failed during shutdown", exc_info=True)


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
