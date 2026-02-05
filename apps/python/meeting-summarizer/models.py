"""Data models for the AI Meeting Summarizer."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional, List


@dataclass
class User:
    """Represents a user in the system."""

    user_id: str
    email: str
    username: str
    created_at: datetime
    updated_at: datetime
    is_active: bool = True
    full_name: Optional[str] = None
    metadata: Optional[dict] = None

    def to_dict(self) -> dict:
        """Convert user to dictionary representation."""
        return {
            'user_id': self.user_id,
            'email': self.email,
            'username': self.username,
            'full_name': self.full_name,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'metadata': self.metadata or {}
        }


@dataclass
class Meeting:
    """Represents a meeting with transcript and AI-generated summary."""

    meeting_id: str
    user_id: str
    title: str
    transcript: str
    summary: str
    action_items: List[str]
    key_points: List[str]
    participants: List[str]
    duration_minutes: int
    created_at: datetime
    updated_at: datetime

    def to_dict(self) -> dict:
        """Convert meeting to dictionary representation."""
        return {
            'meeting_id': self.meeting_id,
            'user_id': self.user_id,
            'title': self.title,
            'transcript': self.transcript,
            'summary': self.summary,
            'action_items': self.action_items,
            'key_points': self.key_points,
            'participants': self.participants,
            'duration_minutes': self.duration_minutes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'word_count': len(self.transcript.split()) if self.transcript else 0
        }
