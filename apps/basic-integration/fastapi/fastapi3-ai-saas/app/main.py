"""Acme AI - FastAPI SaaS Application."""

import atexit
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from posthog import Posthog
from posthog.integrations.asgi import PosthogASGIMiddleware

from app.config import get_settings
from app.database import init_db
from app.posthog_logs import configure_posthog_log_exporter, get_posthog_logger
from app.routers import auth, generate, pages, api_keys, usage, settings as settings_router

settings = get_settings()
templates = Jinja2Templates(directory="app/templates")


def build_posthog_client() -> Optional[Posthog]:
    """Create the process-wide PostHog client when configuration is available."""
    for variable_name, value in (
        ("POSTHOG_API_KEY", settings.posthog_api_key),
        ("POSTHOG_HOST", settings.posthog_host),
    ):
        if not value:
            if settings.debug:
                raise RuntimeError(
                    f"{variable_name} variable required by PostHog is missing or "
                    f"un-configured, this causes events to be silently missed. This "
                    f"error stops appearing once {variable_name} is configured"
                )
            return None

    return Posthog(
        settings.posthog_api_key,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )


posthog_client = build_posthog_client()
posthog_log_provider = None
if posthog_client:
    atexit.register(posthog_client.shutdown)
    posthog_log_provider = configure_posthog_log_exporter(
        settings.posthog_host, settings.posthog_api_key
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    # Initialize database
    init_db()
    if posthog_log_provider:
        get_posthog_logger().info("PostHog log exporter initialized")

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
app.state.posthog_client = posthog_client
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
