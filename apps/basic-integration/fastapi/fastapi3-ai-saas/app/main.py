"""Acme AI - FastAPI SaaS Application."""

import atexit
from contextlib import asynccontextmanager

from posthog import Posthog
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates

from app.config import get_settings
from app.database import init_db
from app.middleware import PostHogMiddleware
from app.routers import auth, generate, pages, api_keys, usage, settings as settings_router

settings = get_settings()
templates = Jinja2Templates(directory="app/templates")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    # Initialize database
    init_db()

    if settings.posthog_project_token and settings.posthog_host:
        app.state.posthog = Posthog(
            settings.posthog_project_token,
            host=settings.posthog_host,
            enable_exception_autocapture=True,
        )
        atexit.register(app.state.posthog.shutdown)
    elif settings.debug:
        missing_variable = (
            "POSTHOG_PROJECT_TOKEN"
            if not settings.posthog_project_token
            else "POSTHOG_HOST"
        )
        raise RuntimeError(
            f"{missing_variable} variable required by PostHog is missing or "
            f"un-configured, this causes events to be silently missed. This error "
            f"stops appearing once {missing_variable} is configured"
        )

    yield

    if posthog_client := getattr(app.state, "posthog", None):
        posthog_client.flush()
        posthog_client.shutdown()


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
    if posthog_client := getattr(request.app.state, "posthog", None):
        posthog_client.capture_exception(exc)

    if request.url.path.startswith("/api/"):
        return JSONResponse({"error": "Internal server error"}, status_code=500)
    return templates.TemplateResponse(request, "500.html", status_code=500)
