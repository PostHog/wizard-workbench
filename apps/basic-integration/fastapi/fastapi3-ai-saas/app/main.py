"""Acme AI - FastAPI SaaS Application."""

from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from posthog.integrations.asgi import PosthogASGIMiddleware

from app.config import get_settings
from app.database import init_db
from app.posthog import get_posthog_client
from app.posthog_logs import get_posthog_log_logger, get_posthog_log_provider
from app.routers import auth, generate, pages, api_keys, usage, settings as settings_router

settings = get_settings()
logger = logging.getLogger(__name__)
templates = Jinja2Templates(directory="app/templates")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    # Initialize database
    init_db()

    posthog_log_logger = get_posthog_log_logger()
    if posthog_log_logger:
        posthog_log_logger.info(
            "application_started",
            extra={"event": "application_started"},
        )

    yield

    posthog_client = get_posthog_client()
    if posthog_client:
        try:
            posthog_client.flush()
        except Exception:
            logger.exception("PostHog flush failed during shutdown")

    posthog_log_provider = get_posthog_log_provider()
    if posthog_log_provider:
        try:
            posthog_log_provider.shutdown(timeout_millis=5000)
        except Exception:
            logger.exception("PostHog log export shutdown failed")


app = FastAPI(
    title=settings.app_name,
    description="AI content generation platform",
    lifespan=lifespan,
)

posthog_client = get_posthog_client()
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
