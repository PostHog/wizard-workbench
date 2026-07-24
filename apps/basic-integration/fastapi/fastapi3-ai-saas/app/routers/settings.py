"""User settings and profile routes."""

from typing import Annotated, Optional

from fastapi import APIRouter, Form, Request, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, EmailStr

from app.dependencies import DbSession, RequiredUser
from app import posthog as posthog_module

router = APIRouter(prefix="/settings", tags=["settings"])
templates = Jinja2Templates(directory="app/templates")


class SettingsUpdate(BaseModel):
    """Settings update request."""
    email: Optional[EmailStr] = None


class PasswordChange(BaseModel):
    """Password change request."""
    current_password: str
    new_password: str


@router.get("", response_class=HTMLResponse)
async def settings_page(request: Request, current_user: RequiredUser, db: DbSession):
    """User settings page."""
    from app.models import APIKey
    api_key_count = db.query(APIKey).filter(
        APIKey.user_id == current_user.id,
        APIKey.is_active == True
    ).count()

    return templates.TemplateResponse(
        request,
        "settings.html",
        {
            "user": current_user,
            "api_key_count": api_key_count,
            "success": None,
            "error": None,
        },
    )


@router.post("", response_class=HTMLResponse)
async def update_settings(
    request: Request,
    current_user: RequiredUser,
    db: DbSession,
    email: Annotated[str, Form()],
):
    """Update user settings."""
    from app.models import User, APIKey

    error = None
    success = None

    # Check if email changed and is available
    if email != current_user.email:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            error = "Email already in use"
        else:
            current_user.email = email
            db.commit()
            if posthog_module.posthog_client is not None:
                posthog_module.posthog_client.set(
                    str(current_user.id),
                    properties={"email": current_user.email},
                )
                posthog_module.posthog_client.capture("email_updated")
            success = "Settings updated successfully"
    else:
        success = "No changes made"

    api_key_count = db.query(APIKey).filter(
        APIKey.user_id == current_user.id,
        APIKey.is_active == True
    ).count()

    return templates.TemplateResponse(
        request,
        "settings.html",
        {
            "user": current_user,
            "api_key_count": api_key_count,
            "success": success,
            "error": error,
        },
    )


@router.post("/password", response_class=HTMLResponse)
async def change_password(
    request: Request,
    current_user: RequiredUser,
    db: DbSession,
    current_password: Annotated[str, Form()],
    new_password: Annotated[str, Form()],
):
    """Change user password."""
    from app.models import APIKey

    error = None
    success = None

    if not current_user.check_password(current_password):
        error = "Current password is incorrect"
    elif len(new_password) < 6:
        error = "New password must be at least 6 characters"
    else:
        current_user.set_password(new_password)
        db.commit()
        if posthog_module.posthog_client is not None:
            posthog_module.posthog_client.capture("password_changed")
        success = "Password changed successfully"

    api_key_count = db.query(APIKey).filter(
        APIKey.user_id == current_user.id,
        APIKey.is_active == True
    ).count()

    return templates.TemplateResponse(
        request,
        "settings.html",
        {
            "user": current_user,
            "api_key_count": api_key_count,
            "success": success,
            "error": error,
        },
    )
