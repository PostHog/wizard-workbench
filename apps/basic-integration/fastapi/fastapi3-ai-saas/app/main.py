"""Acme AI - FastAPI SaaS Application."""

import atexit
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from posthog import Posthog

from app.config import get_settings
from app.database import init_db
from app.middleware import PostHogMiddleware
from app.routers import auth, generate, pages, api_keys, usage, settings as settings_router

settings = get_settings()
templates = Jinja2Templates(directory="app/templates")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    app.state.posthog_client = None
    app.state.posthog_log_provider = None
    app.state.posthog_log_logger = None

    if settings.posthog_project_token and settings.posthog_host:
        app.state.posthog_client = Posthog(
            settings.posthog_project_token,
            host=settings.posthog_host,
            enable_exception_autocapture=True,
        )
        atexit.register(app.state.posthog_client.shutdown)

        from opentelemetry._logs import set_logger_provider
        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

        log_provider = LoggerProvider()
        set_logger_provider(log_provider)
        log_provider.add_log_record_processor(
            BatchLogRecordProcessor(
                OTLPLogExporter(
                    endpoint=f"{settings.posthog_host.rstrip('/')}/i/v1/logs",
                    headers={"Authorization": f"Bearer {settings.posthog_project_token}"},
                )
            )
        )
        posthog_log_logger = logging.getLogger("posthog.export")
        posthog_log_logger.setLevel(logging.INFO)
        posthog_log_logger.propagate = False
        posthog_log_logger.addHandler(LoggingHandler(logger_provider=log_provider))
        app.state.posthog_log_provider = log_provider
        app.state.posthog_log_logger = posthog_log_logger
        posthog_log_logger.info(
            "PostHog log export initialized",
            extra={"event": "posthog_log_export_initialized", "service": "acme_ai"},
        )
    elif settings.debug:
        missing_var = (
            "POSTHOG_PROJECT_TOKEN"
            if not settings.posthog_project_token
            else "POSTHOG_HOST"
        )
        raise RuntimeError(
            f"{missing_var} variable required by PostHog is missing or un-configured, "
            f"this causes events to be silently missed. This error stops appearing "
            f"once {missing_var} is configured"
        )

    # Initialize database
    init_db()

    yield

    if app.state.posthog_client:
        app.state.posthog_client.flush()
    if app.state.posthog_log_provider:
        app.state.posthog_log_provider.force_flush()
        app.state.posthog_log_provider.shutdown()


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
    posthog_client = request.app.state.posthog_client
    if posthog_client:
        posthog_client.capture_exception(exc)

    if request.url.path.startswith("/api/"):
        return JSONResponse({"error": "Internal server error"}, status_code=500)
    return templates.TemplateResponse(request, "500.html", status_code=500)
