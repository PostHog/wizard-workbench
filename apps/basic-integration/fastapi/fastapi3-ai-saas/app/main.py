"""Acme AI - FastAPI SaaS Application."""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates

from app.analytics import get_posthog_client, initialize_posthog
from app.config import get_settings
from app.database import init_db
from app.middleware import PostHogIdentityMiddleware
from app.routers import auth, generate, pages, api_keys, usage, settings as settings_router

settings = get_settings()
templates = Jinja2Templates(directory="app/templates")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    posthog_client = initialize_posthog(settings)
    init_db()

    yield

    if posthog_client:
        posthog_client.flush()


app = FastAPI(
    title=settings.app_name,
    description="AI content generation platform",
    lifespan=lifespan,
)
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
    posthog_client = get_posthog_client()
    if posthog_client:
        posthog_client.capture_exception(exc)

    if request.url.path.startswith("/api/"):
        return JSONResponse({"error": "Internal server error"}, status_code=500)
    return templates.TemplateResponse(request, "500.html", status_code=500)
