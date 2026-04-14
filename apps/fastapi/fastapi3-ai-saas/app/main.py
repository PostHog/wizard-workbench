"""Acme AI - FastAPI SaaS Application."""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from posthog import identify_context, new_context, set_context_session
from starlette.middleware.base import BaseHTTPMiddleware

from app.analytics import posthog_client
from app.config import get_settings
from app.database import init_db
from app.dependencies import get_session_user_id
from app.routers import auth, generate, pages, api_keys, usage, settings as settings_router

settings = get_settings()
templates = Jinja2Templates(directory="app/templates")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events for startup/shutdown."""
    # Initialize database
    init_db()

    yield

    # Flush PostHog events before shutdown
    posthog_client.flush()


class PostHogMiddleware(BaseHTTPMiddleware):
    """Middleware that wraps each request in a PostHog context."""

    async def dispatch(self, request: Request, call_next):
        with new_context():
            # Identify user from session cookie
            session_token = request.cookies.get("session_token")
            if session_token:
                user_id = get_session_user_id(session_token)
                if user_id is not None:
                    identify_context(str(user_id))

            # Correlate with frontend PostHog session if headers are present
            frontend_distinct_id = request.headers.get("X-POSTHOG-DISTINCT-ID")
            frontend_session_id = request.headers.get("X-POSTHOG-SESSION-ID")
            if frontend_distinct_id:
                identify_context(frontend_distinct_id)
            if frontend_session_id:
                set_context_session(frontend_session_id)

            response = await call_next(request)
        return response


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
    """Handle 500 errors."""
    if request.url.path.startswith("/api/"):
        return JSONResponse({"error": "Internal server error"}, status_code=500)
    return templates.TemplateResponse(request, "500.html", status_code=500)
