"""Acme AI - FastAPI SaaS Application."""

import atexit
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from posthog import Posthog
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates

from app.config import get_settings
from app.database import init_db
from app.middleware import PostHogIdentityMiddleware
from app.posthog_logs import configure_posthog_logs, get_posthog_logger
from app.routers import auth, generate, pages, api_keys, usage, settings as settings_router

settings = get_settings()
templates = Jinja2Templates(directory="app/templates")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    posthog_client = None
    posthog_log_provider = None
    if settings.posthog_project_api_key and settings.posthog_host:
        posthog_client = Posthog(
            settings.posthog_project_api_key,
            host=settings.posthog_host,
            enable_exception_autocapture=True,
        )
        app.state.posthog_client = posthog_client
        atexit.register(posthog_client.shutdown)
        posthog_log_provider = configure_posthog_logs(
            settings.posthog_host, settings.posthog_project_api_key
        )
        get_posthog_logger().info("posthog_log_export_configured")
    elif settings.debug:
        missing_variable = (
            "POSTHOG_PROJECT_API_KEY"
            if not settings.posthog_project_api_key
            else "POSTHOG_HOST"
        )
        raise RuntimeError(
            f"{missing_variable} variable required by PostHog is missing or "
            f"un-configured, this causes events to be silently missed. This error "
            f"stops appearing once {missing_variable} is configured"
        )

    # Initialize database
    init_db()

    yield

    if posthog_log_provider:
        get_posthog_logger().info("posthog_log_export_stopping")
        posthog_log_provider.force_flush()
        posthog_log_provider.shutdown()

    if posthog_client:
        posthog_client.flush()


app = FastAPI(
    title=settings.app_name,
    description="AI content generation platform",
    lifespan=lifespan,
)
app.state.posthog_client = None
app.add_middleware(PostHogIdentityMiddleware)

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
