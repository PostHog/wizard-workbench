"""Usage history and stats routes."""

from datetime import datetime, timedelta, timezone
from typing import List, Optional

from fastapi import APIRouter, Query
from pydantic import BaseModel

from app.dependencies import DbSession, RequiredUser
from app.models import Generation

router = APIRouter(prefix="/api/usage", tags=["usage"])


class GenerationRecord(BaseModel):
    """A single generation record."""
    id: int
    generation_type: str
    prompt: str
    credits_used: int
    created_at: str

    class Config:
        from_attributes = True


class UsageStats(BaseModel):
    """Usage statistics."""
    total_generations: int
    total_credits_used: int
    generations_today: int
    credits_used_today: int
    by_type: dict


class UsageResponse(BaseModel):
    """Full usage response."""
    stats: UsageStats
    recent: List[GenerationRecord]


@router.get("", response_model=UsageResponse)
async def get_usage(
    current_user: RequiredUser,
    db: DbSession,
    days: int = Query(30, ge=1, le=90),
):
    """Get usage statistics and recent generations."""
    # All generations for this user
    all_gens = db.query(Generation).filter(
        Generation.user_id == current_user.id
    ).all()

    # Today's generations
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today_gens = [g for g in all_gens if g.created_at.replace(tzinfo=timezone.utc) >= today_start]

    # By type breakdown
    by_type = {}
    for gen in all_gens:
        if gen.generation_type not in by_type:
            by_type[gen.generation_type] = {"count": 0, "credits": 0}
        by_type[gen.generation_type]["count"] += 1
        by_type[gen.generation_type]["credits"] += gen.credits_used

    # Recent generations (within days range)
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    recent = db.query(Generation).filter(
        Generation.user_id == current_user.id,
        Generation.created_at >= cutoff
    ).order_by(Generation.created_at.desc()).limit(50).all()

    stats = UsageStats(
        total_generations=len(all_gens),
        total_credits_used=sum(g.credits_used for g in all_gens),
        generations_today=len(today_gens),
        credits_used_today=sum(g.credits_used for g in today_gens),
        by_type=by_type,
    )

    return UsageResponse(
        stats=stats,
        recent=[
            GenerationRecord(
                id=g.id,
                generation_type=g.generation_type,
                prompt=g.prompt[:100] + "..." if len(g.prompt) > 100 else g.prompt,
                credits_used=g.credits_used,
                created_at=g.created_at.isoformat(),
            )
            for g in recent
        ],
    )
