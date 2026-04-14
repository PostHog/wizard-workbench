"""API key management routes."""

from typing import List

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.analytics import posthog_client
from app.dependencies import DbSession, RequiredUser
from app.models import APIKey

router = APIRouter(prefix="/api/keys", tags=["api-keys"])


class APIKeyCreate(BaseModel):
    """Request to create an API key."""
    name: str = Field(..., min_length=1, max_length=100)


class APIKeyResponse(BaseModel):
    """API key response (key only shown on creation)."""
    id: int
    name: str
    key_prefix: str  # First 12 chars only
    is_active: bool
    created_at: str

    class Config:
        from_attributes = True


class APIKeyCreated(APIKeyResponse):
    """Response when API key is created (includes full key)."""
    key: str  # Full key - only shown once!


@router.get("", response_model=List[APIKeyResponse])
async def list_api_keys(current_user: RequiredUser, db: DbSession):
    """List all API keys for the current user."""
    keys = db.query(APIKey).filter(
        APIKey.user_id == current_user.id
    ).order_by(APIKey.created_at.desc()).all()

    return [
        APIKeyResponse(
            id=k.id,
            name=k.name,
            key_prefix=k.key[:12] + "...",
            is_active=k.is_active,
            created_at=k.created_at.isoformat(),
        )
        for k in keys
    ]


@router.post("", response_model=APIKeyCreated, status_code=status.HTTP_201_CREATED)
async def create_api_key(
    request: APIKeyCreate,
    current_user: RequiredUser,
    db: DbSession,
):
    """Create a new API key."""
    # Limit to 5 active keys per user
    active_count = db.query(APIKey).filter(
        APIKey.user_id == current_user.id,
        APIKey.is_active == True
    ).count()

    if active_count >= 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum of 5 active API keys allowed",
        )

    api_key = APIKey.create(db, user_id=current_user.id, name=request.name)

    posthog_client.capture(
        "api_key_created",
        distinct_id=str(current_user.id),
        properties={"active_key_count": active_count + 1},
    )

    return APIKeyCreated(
        id=api_key.id,
        name=api_key.name,
        key=api_key.key,  # Only time full key is shown
        key_prefix=api_key.key[:12] + "...",
        is_active=api_key.is_active,
        created_at=api_key.created_at.isoformat(),
    )


@router.delete("/{key_id}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_api_key(
    key_id: int,
    current_user: RequiredUser,
    db: DbSession,
):
    """Revoke (deactivate) an API key."""
    api_key = db.query(APIKey).filter(
        APIKey.id == key_id,
        APIKey.user_id == current_user.id,
    ).first()

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found",
        )

    api_key.is_active = False
    db.commit()

    posthog_client.capture("api_key_revoked", distinct_id=str(current_user.id))

    return None
