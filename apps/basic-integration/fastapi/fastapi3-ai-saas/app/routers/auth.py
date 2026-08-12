"""Authentication routes."""

from typing import Annotated

from fastapi import APIRouter, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from app.analytics import get_posthog_client
from app.config import get_settings
from app.dependencies import CurrentUser, DbSession, RequiredUser, create_session_token
from app.models import User

router = APIRouter()
settings = get_settings()
templates = Jinja2Templates(directory="app/templates")


@router.get("/login", response_class=HTMLResponse)
async def login_page(request: Request, current_user: CurrentUser):
    """Login page."""
    if current_user:
        return RedirectResponse(url="/dashboard", status_code=302)
    return templates.TemplateResponse(request, "login.html", {"error": None})


@router.post("/login", response_class=HTMLResponse)
async def login(
    request: Request,
    db: DbSession,
    email: Annotated[str, Form()],
    password: Annotated[str, Form()],
):
    """Handle login form submission."""
    user = User.authenticate(db, email, password)

    if user:
        _identify_and_capture_user(user, "user_logged_in")
        response = RedirectResponse(url="/dashboard", status_code=302)
        response.set_cookie(
            key="session_token",
            value=create_session_token(user.id),
            httponly=True,
            samesite="lax",
        )
        return response

    return templates.TemplateResponse(
        request, "login.html", {"error": "Invalid email or password"}
    )


@router.get("/signup", response_class=HTMLResponse)
async def signup_page(request: Request, current_user: CurrentUser):
    """Signup page."""
    if current_user:
        return RedirectResponse(url="/dashboard", status_code=302)
    return templates.TemplateResponse(request, "signup.html", {"error": None})


@router.post("/signup", response_class=HTMLResponse)
async def signup(
    request: Request,
    db: DbSession,
    email: Annotated[str, Form()],
    password: Annotated[str, Form()],
):
    """Handle signup form submission."""
    if User.get_by_email(db, email):
        return templates.TemplateResponse(
            request, "signup.html", {"error": "Email already registered"}
        )

    user = User.create(db, email=email, password=password, credits=settings.default_credits)
    _identify_and_capture_user(user, "user_signed_up")

    response = RedirectResponse(url="/dashboard", status_code=302)
    response.set_cookie(
        key="session_token",
        value=create_session_token(user.id),
        httponly=True,
        samesite="lax",
    )
    return response


def _identify_and_capture_user(user: User, event: str) -> None:
    """Set person properties and capture an authentication event for a user."""
    client = get_posthog_client()
    if client is None:
        return

    with client.new_context(fresh=True):
        client.identify_context(str(user.id))
        client.set(
            distinct_id=str(user.id),
            properties={"email": user.email, "credits": user.credits},
        )
        client.capture(event, properties={"auth_method": "password"})


@router.get("/logout")
async def logout(current_user: RequiredUser):
    """Logout user."""
    client = get_posthog_client()
    if client:
        client.capture("user_logged_out")

    response = RedirectResponse(url="/", status_code=302)
    response.delete_cookie(key="session_token")
    return response
