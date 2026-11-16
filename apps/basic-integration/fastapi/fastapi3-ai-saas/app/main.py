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
templates = Jinja2Templates(directory="app/templates")
logger = logging.getLogger(__name__)

posthog_client: Posthog | None = None
posthog_log_provider = None
posthog_logs_logger: logging.Logger | None = None
if settings.posthog_api_key and settings.posthog_host:
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    posthog_client = Posthog(
        settings.posthog_api_key,
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
                headers={"Authorization": f"Bearer {settings.posthog_api_key}"},
                timeout=3,
            )
        )
    )
    posthog_logs_logger = logging.getLogger("acme_ai.posthog_logs")
    posthog_logs_logger.setLevel(logging.INFO)
    posthog_logs_logger.addHandler(LoggingHandler(logger_provider=posthog_log_provider))
    posthog_logs_logger.propagate = False
elif settings.debug:
    missing_var = "POSTHOG_API_KEY" if not settings.posthog_api_key else "POSTHOG_HOST"
    logger.warning(
        "%s variable required by PostHog is missing or un-configured, this causes "
        "events to be silently missed. This error stops appearing once %s is configured",
        missing_var,
        missing_var,
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    # Initialize database
    init_db()
    if posthog_logs_logger:
        posthog_logs_logger.info(
            "application_started",
            extra={"event": "application_started", "service": "acme-ai"},
        )

    yield

    if posthog_client:
        try:
            posthog_client.flush()
        except Exception:
            logger.warning("PostHog events could not be flushed during shutdown", exc_info=True)
    if posthog_log_provider:
        try:
            posthog_log_provider.shutdown(timeout_millis=3_000)
        except Exception:
            logger.warning("PostHog logs could not be flushed during shutdown", exc_info=True)


app = FastAPI(
    title=settings.app_name,
    description="AI content generation platform",
    lifespan=lifespan,
)
app.state.posthog_client = posthog_client
app.state.posthog_logs_logger = posthog_logs_logger

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
