"""Authentication routes."""

from typing import Annotated

from fastapi import APIRouter, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from app import posthog
from app.config import get_settings
from app.dependencies import CurrentUser, DbSession, RequiredUser, create_session_token
from app.models import User

router = APIRouter()
settings = get_settings()
templates = Jinja2Templates(directory="app/templates")


def identify_authenticated_user(user: User) -> None:
    """Bind the newly authenticated user to the active request context."""
    if posthog.posthog_client is None:
        return

    distinct_id = str(user.id)
    posthog.posthog_client.identify_context(distinct_id)
    posthog.posthog_client.set(
        distinct_id=distinct_id,
        properties={"email": user.email},
    )


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
        identify_authenticated_user(user)
        if posthog.posthog_client is not None:
            posthog.posthog_client.capture("user_logged_in")
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
    identify_authenticated_user(user)
    if posthog.posthog_client is not None:
        posthog.posthog_client.capture("user_signed_up")

    response = RedirectResponse(url="/dashboard", status_code=302)
    response.set_cookie(
        key="session_token",
        value=create_session_token(user.id),
        httponly=True,
        samesite="lax",
    )
    return response


@router.get("/logout")
async def logout(current_user: RequiredUser):
    """Logout user."""
    if posthog.posthog_client is not None:
        posthog.posthog_client.capture("user_logged_out")

    response = RedirectResponse(url="/", status_code=302)
    response.delete_cookie(key="session_token")
    return response
