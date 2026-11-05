"""Acme AI - FastAPI SaaS Application."""

import atexit
import logging
import warnings
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from posthog import Posthog
from posthog.integrations.asgi import PosthogASGIMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates

from app.config import get_settings
from app.database import init_db
from app.posthog_logs import POSTHOG_LOGGER_NAME, configure_posthog_log_export
from app.routers import auth, generate, pages, api_keys, usage, settings as settings_router

settings = get_settings()
templates = Jinja2Templates(directory="app/templates")

posthog_client: Posthog | None = None
posthog_log_provider = None
if settings.posthog_api_key and settings.posthog_host:
    posthog_client = Posthog(
        settings.posthog_api_key,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    posthog_log_provider = configure_posthog_log_export(
        settings.posthog_api_key, settings.posthog_host
    )
    atexit.register(posthog_client.shutdown)
    logging.getLogger(POSTHOG_LOGGER_NAME).info("posthog_log_export_configured")
elif settings.debug:
    missing_variable = (
        "POSTHOG_API_KEY" if not settings.posthog_api_key else "POSTHOG_HOST"
    )
    warnings.warn(
        f"{missing_variable} variable required by PostHog is missing or un-configured, "
        f"this causes events to be silently missed. This error stops appearing once "
        f"{missing_variable} is configured",
        RuntimeWarning,
        stacklevel=2,
    )


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
        posthog_log_provider.shutdown()


app = FastAPI(
    title=settings.app_name,
    description="AI content generation platform",
    lifespan=lifespan,
)

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
