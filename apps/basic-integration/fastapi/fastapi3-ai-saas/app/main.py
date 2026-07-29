"""Acme AI - FastAPI SaaS Application."""

from contextlib import asynccontextmanager

import atexit
from posthog import Posthog
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates

from app.config import get_settings
from app.database import init_db
from app.middleware import PostHogContextMiddleware
from app.routers import auth, generate, pages, api_keys, usage, settings as settings_router

settings = get_settings()
templates = Jinja2Templates(directory="app/templates")
posthog_client: Posthog | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    global posthog_client

    if not settings.posthog_project_token:
        if settings.debug:
            raise RuntimeError(
                "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing once "
                "POSTHOG_PROJECT_TOKEN is configured"
            )
    elif not settings.posthog_host:
        if settings.debug:
            raise RuntimeError(
                "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing once "
                "POSTHOG_HOST is configured"
            )
    else:
        posthog_client = Posthog(
            settings.posthog_project_token,
            host=settings.posthog_host,
            enable_exception_autocapture=True,
        )
        atexit.register(posthog_client.shutdown)
        app.state.posthog_client = posthog_client

    # Initialize database
    init_db()

    yield

    if posthog_client is not None:
        posthog_client.shutdown()


app = FastAPI(
    title=settings.app_name,
    description="AI content generation platform",
    lifespan=lifespan,
)

app.add_middleware(PostHogContextMiddleware)

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
