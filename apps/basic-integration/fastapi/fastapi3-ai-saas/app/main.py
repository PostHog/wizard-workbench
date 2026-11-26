"""Acme AI - FastAPI SaaS Application."""

import atexit
import logging
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from posthog import Posthog
from posthog.integrations.asgi import PosthogASGIMiddleware

from app.config import get_settings
from app.database import init_db
from app.dependencies import identify_current_user
from app.posthog_logs import configure_posthog_log_export
from app.routers import auth, generate, pages, api_keys, usage, settings as settings_router

settings = get_settings()
templates = Jinja2Templates(directory="app/templates")
logger = logging.getLogger(__name__)

posthog_client: Posthog | None = None
posthog_log_logger: logging.Logger | None = None
posthog_log_provider = None
if settings.posthog_project_token and settings.posthog_host:
    posthog_client = Posthog(
        settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
        timeout=3,
        max_retries=0,
    )
    atexit.register(posthog_client.shutdown)
    posthog_log_logger, posthog_log_provider = configure_posthog_log_export(
        settings.posthog_host, settings.posthog_project_token
    )
elif settings.debug:
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


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    # Initialize database
    init_db()

    if app.state.posthog_log_logger:
        app.state.posthog_log_logger.info(
            "application_ready", extra={"event": "application_ready"}
        )

    yield

    if posthog_client:
        try:
            posthog_client.flush()
        except Exception:
            logger.warning("Unable to flush PostHog events during shutdown", exc_info=True)

    if app.state.posthog_log_provider:
        try:
            app.state.posthog_log_provider.shutdown()
        except Exception:
            logger.warning("Unable to shut down PostHog log export", exc_info=True)


app = FastAPI(
    title=settings.app_name,
    description="AI content generation platform",
    lifespan=lifespan,
    dependencies=[Depends(identify_current_user)],
)
app.state.posthog_client = posthog_client
app.state.posthog_log_logger = posthog_log_logger
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
