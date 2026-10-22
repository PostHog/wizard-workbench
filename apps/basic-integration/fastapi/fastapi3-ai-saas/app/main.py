"""Acme AI - FastAPI SaaS Application."""

import atexit
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.sdk.resources import Resource
from posthog import Posthog
from posthog.integrations.asgi import PosthogASGIMiddleware

from app.config import get_settings
from app.database import init_db
from app.routers import auth, generate, pages, api_keys, usage, settings as settings_router

settings = get_settings()
templates = Jinja2Templates(directory="app/templates")


def create_posthog_client() -> Posthog | None:
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

    return Posthog(
        settings.posthog_api_key,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )


def configure_posthog_log_exporter() -> LoggerProvider:
    """Export only records emitted through the dedicated PostHog logger."""
    logger_provider = LoggerProvider(
        resource=Resource.create({"service.name": settings.app_name})
    )
    set_logger_provider(logger_provider)

    exporter = OTLPLogExporter(
        endpoint=f"{settings.posthog_host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {settings.posthog_api_key}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    posthog_logger = logging.getLogger("app.posthog_logs")
    posthog_logger.setLevel(logging.INFO)
    posthog_logger.propagate = False
    posthog_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    return logger_provider


posthog_client = create_posthog_client()
posthog_log_provider = configure_posthog_log_exporter() if posthog_client else None
if posthog_client:
    atexit.register(posthog_client.shutdown)
if posthog_log_provider:
    atexit.register(posthog_log_provider.shutdown)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    # Initialize database
    init_db()

    yield

    if posthog_client:
        posthog_client.flush()
    if posthog_log_provider:
        posthog_log_provider.force_flush()


app = FastAPI(
    title=settings.app_name,
    description="AI content generation platform",
    lifespan=lifespan,
)
app.state.posthog = posthog_client

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
