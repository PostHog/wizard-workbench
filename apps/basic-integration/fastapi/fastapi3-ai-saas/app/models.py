"""Database models for Acme AI."""

import secrets
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Boolean, DateTime, Integer, String, Text, ForeignKey
from sqlalchemy.orm import Mapped, Session, mapped_column, relationship
from werkzeug.security import check_password_hash, generate_password_hash

from app.database import Base


class User(Base):
    """User account model."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(254), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(256), nullable=False)
    credits: Mapped[int] = mapped_column(Integer, default=100)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    api_keys: Mapped[list["APIKey"]] = relationship("APIKey", back_populates="user")
    generations: Mapped[list["Generation"]] = relationship("Generation", back_populates="user")
    activities: Mapped[list["Activity"]] = relationship("Activity", back_populates="user")

    def set_password(self, password: str) -> None:
        """Hash and set the user's password."""
        self.password_hash = generate_password_hash(password, method="pbkdf2:sha256")

    def check_password(self, password: str) -> bool:
        """Verify the password against the hash."""
        return check_password_hash(self.password_hash, password)

    def use_credits(self, amount: int) -> bool:
        """Deduct credits if available. Returns True if successful."""
        if self.credits >= amount:
            self.credits -= amount
            return True
        return False

    @classmethod
    def create(cls, db: Session, email: str, password: str, credits: int = 100) -> "User":
        """Create a new user."""
        user = cls(email=email, credits=credits)
        user.set_password(password)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @classmethod
    def get_by_id(cls, db: Session, user_id: int) -> Optional["User"]:
        """Get user by ID."""
        return db.query(cls).filter(cls.id == user_id).first()

    @classmethod
    def get_by_email(cls, db: Session, email: str) -> Optional["User"]:
        """Get user by email."""
        return db.query(cls).filter(cls.email == email).first()

    @classmethod
    def authenticate(cls, db: Session, email: str, password: str) -> Optional["User"]:
        """Authenticate user with email and password."""
        user = cls.get_by_email(db, email)
        if user and user.check_password(password):
            return user
        return None


class APIKey(Base):
    """API key for programmatic access."""

    __tablename__ = "api_keys"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    key: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="api_keys")

    @classmethod
    def create(cls, db: Session, user_id: int, name: str) -> "APIKey":
        """Create a new API key."""
        key = f"acme_{secrets.token_hex(24)}"
        api_key = cls(key=key, name=name, user_id=user_id)
        db.add(api_key)
        db.commit()
        db.refresh(api_key)
        return api_key

    @classmethod
    def get_by_key(cls, db: Session, key: str) -> Optional["APIKey"]:
        """Get API key by key string."""
        return db.query(cls).filter(cls.key == key, cls.is_active == True).first()


class Generation(Base):
    """Record of AI content generation."""

    __tablename__ = "generations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    generation_type: Mapped[str] = mapped_column(String(50), nullable=False)  # blog, email, social
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    result: Mapped[str] = mapped_column(Text, nullable=False)
    credits_used: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="generations")

    @classmethod
    def create(
        cls, db: Session, user_id: int, generation_type: str, prompt: str, result: str, credits_used: int
    ) -> "Generation":
        """Create a generation record."""
        gen = cls(
            user_id=user_id,
            generation_type=generation_type,
            prompt=prompt,
            result=result,
            credits_used=credits_used,
        )
        db.add(gen)
        db.commit()
        db.refresh(gen)
        return gen


class Activity(Base):
    """Activity log for user actions."""

    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="activities")

    @classmethod
    def log(cls, db: Session, user_id: int, action: str, description: str) -> "Activity":
        """Log a user activity."""
        activity = cls(user_id=user_id, action=action, description=description)
        db.add(activity)
        db.commit()
        db.refresh(activity)
        return activity
