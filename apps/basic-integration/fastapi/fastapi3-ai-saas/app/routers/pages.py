"""Web page routes."""

from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from app.dependencies import CurrentUser, DbSession, RequiredUser
from app.models import Generation, APIKey, Activity
from app.posthog import posthog_client

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


@router.get("/", response_class=HTMLResponse)
async def home(request: Request, current_user: CurrentUser):
    """Home page - redirect to dashboard if logged in."""
    if current_user:
        return RedirectResponse(url="/dashboard", status_code=302)

    return templates.TemplateResponse(request, "home.html", {})


@router.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request, current_user: RequiredUser, db: DbSession):
    """User dashboard showing credits and recent generations."""
    # Get recent generations
    recent = (
        db.query(Generation)
        .filter(Generation.user_id == current_user.id)
        .order_by(Generation.created_at.desc())
        .limit(5)
        .all()
    )

    # Stats
    all_generations = db.query(Generation).filter(Generation.user_id == current_user.id).all()
    total_generations = len(all_generations)
    total_credits_used = sum(g.credits_used for g in all_generations)

    # API keys count
    api_key_count = db.query(APIKey).filter(
        APIKey.user_id == current_user.id,
        APIKey.is_active == True
    ).count()

    # Recent activity
    recent_activity = (
        db.query(Activity)
        .filter(Activity.user_id == current_user.id)
        .order_by(Activity.created_at.desc())
        .limit(5)
        .all()
    )

    posthog_client.capture(
        "dashboard_viewed",
        distinct_id=str(current_user.id),
        properties={
            "total_generations": total_generations,
            "credits_remaining": current_user.credits,
        },
    )

    return templates.TemplateResponse(
        request,
        "dashboard.html",
        {
            "user": current_user,
            "recent_generations": recent,
            "total_generations": total_generations,
            "total_credits_used": total_credits_used,
            "api_key_count": api_key_count,
            "recent_activity": recent_activity,
        },
    )
