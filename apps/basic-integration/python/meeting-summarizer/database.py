"""Database operations for AI Meeting Summarizer."""

import sqlite3
from datetime import datetime
from typing import List, Optional
import json

from models import User, Meeting


class UserDatabase:
    """Manages user data in SQLite database."""

    def __init__(self, db_path: str = "users.db"):
        """Initialize database connection."""
        self.db_path = db_path
        self.init_database()

    def init_database(self):
        """Create tables if they don't exist."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    user_id TEXT PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    username TEXT UNIQUE NOT NULL,
                    full_name TEXT,
                    is_active INTEGER DEFAULT 1,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    metadata TEXT
                )
            """)

            conn.execute("""
                CREATE TABLE IF NOT EXISTS meetings (
                    meeting_id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    transcript TEXT NOT NULL,
                    summary TEXT NOT NULL,
                    action_items TEXT NOT NULL,
                    key_points TEXT NOT NULL,
                    participants TEXT NOT NULL,
                    duration_minutes INTEGER NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users (user_id)
                )
            """)

            conn.commit()

    def create_user(self, user: User) -> bool:
        """Create a new user in the database."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.execute("""
                    INSERT INTO users (user_id, email, username, full_name, is_active, created_at, updated_at, metadata)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    user.user_id,
                    user.email,
                    user.username,
                    user.full_name,
                    1 if user.is_active else 0,
                    user.created_at.isoformat(),
                    user.updated_at.isoformat(),
                    json.dumps(user.metadata) if user.metadata else None
                ))
                conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False

    def get_user(self, user_id: str) -> Optional[User]:
        """Get a user by ID."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute(
                "SELECT * FROM users WHERE user_id = ?",
                (user_id,)
            )
            row = cursor.fetchone()

            if row:
                return User(
                    user_id=row['user_id'],
                    email=row['email'],
                    username=row['username'],
                    full_name=row['full_name'],
                    is_active=bool(row['is_active']),
                    created_at=datetime.fromisoformat(row['created_at']),
                    updated_at=datetime.fromisoformat(row['updated_at']),
                    metadata=json.loads(row['metadata']) if row['metadata'] else None
                )
            return None

    def list_users(self, active_only: bool = False) -> List[User]:
        """List all users, optionally filtering by active status."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row

            query = "SELECT * FROM users"
            if active_only:
                query += " WHERE is_active = 1"
            query += " ORDER BY created_at DESC"

            cursor = conn.execute(query)
            rows = cursor.fetchall()

            return [
                User(
                    user_id=row['user_id'],
                    email=row['email'],
                    username=row['username'],
                    full_name=row['full_name'],
                    is_active=bool(row['is_active']),
                    created_at=datetime.fromisoformat(row['created_at']),
                    updated_at=datetime.fromisoformat(row['updated_at']),
                    metadata=json.loads(row['metadata']) if row['metadata'] else None
                )
                for row in rows
            ]

    def update_user(self, user_id: str, **kwargs) -> bool:
        """Update user fields."""
        allowed_fields = {'email', 'username', 'full_name', 'is_active', 'metadata'}
        updates = {k: v for k, v in kwargs.items() if k in allowed_fields}

        if not updates:
            return False

        updates['updated_at'] = datetime.now().isoformat()

        # Convert metadata to JSON string if present
        if 'metadata' in updates:
            updates['metadata'] = json.dumps(updates['metadata'])

        # Convert is_active to integer if present
        if 'is_active' in updates:
            updates['is_active'] = 1 if updates['is_active'] else 0

        set_clause = ', '.join(f"{k} = ?" for k in updates.keys())
        values = list(updates.values()) + [user_id]

        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                f"UPDATE users SET {set_clause} WHERE user_id = ?",
                values
            )
            conn.commit()
            return cursor.rowcount > 0

    def delete_user(self, user_id: str) -> bool:
        """Delete a user from the database."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "DELETE FROM users WHERE user_id = ?",
                (user_id,)
            )
            conn.commit()
            return cursor.rowcount > 0

    def deactivate_user(self, user_id: str) -> bool:
        """Deactivate a user (soft delete)."""
        return self.update_user(user_id, is_active=False)

    # Meeting operations

    def create_meeting(self, meeting: Meeting) -> bool:
        """Create a new meeting."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.execute("""
                    INSERT INTO meetings (meeting_id, user_id, title, transcript, summary,
                                        action_items, key_points, participants, duration_minutes,
                                        created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    meeting.meeting_id,
                    meeting.user_id,
                    meeting.title,
                    meeting.transcript,
                    meeting.summary,
                    json.dumps(meeting.action_items),
                    json.dumps(meeting.key_points),
                    json.dumps(meeting.participants),
                    meeting.duration_minutes,
                    meeting.created_at.isoformat(),
                    meeting.updated_at.isoformat()
                ))
                conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False

    def get_meeting(self, meeting_id: str) -> Optional[Meeting]:
        """Get a meeting by ID."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute(
                "SELECT * FROM meetings WHERE meeting_id = ?",
                (meeting_id,)
            )
            row = cursor.fetchone()

            if row:
                return Meeting(
                    meeting_id=row['meeting_id'],
                    user_id=row['user_id'],
                    title=row['title'],
                    transcript=row['transcript'],
                    summary=row['summary'],
                    action_items=json.loads(row['action_items']),
                    key_points=json.loads(row['key_points']),
                    participants=json.loads(row['participants']),
                    duration_minutes=row['duration_minutes'],
                    created_at=datetime.fromisoformat(row['created_at']),
                    updated_at=datetime.fromisoformat(row['updated_at'])
                )
            return None

    def list_meetings(self, user_id: str, limit: int = 100, offset: int = 0) -> List[Meeting]:
        """List meetings for a user."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute(
                """SELECT * FROM meetings
                   WHERE user_id = ?
                   ORDER BY created_at DESC
                   LIMIT ? OFFSET ?""",
                (user_id, limit, offset)
            )
            rows = cursor.fetchall()

            return [
                Meeting(
                    meeting_id=row['meeting_id'],
                    user_id=row['user_id'],
                    title=row['title'],
                    transcript=row['transcript'],
                    summary=row['summary'],
                    action_items=json.loads(row['action_items']),
                    key_points=json.loads(row['key_points']),
                    participants=json.loads(row['participants']),
                    duration_minutes=row['duration_minutes'],
                    created_at=datetime.fromisoformat(row['created_at']),
                    updated_at=datetime.fromisoformat(row['updated_at'])
                )
                for row in rows
            ]

    def update_meeting(self, meeting_id: str, **kwargs) -> bool:
        """Update meeting fields."""
        allowed_fields = {'title', 'transcript', 'summary', 'action_items', 'key_points', 'participants', 'duration_minutes'}
        updates = {k: v for k, v in kwargs.items() if k in allowed_fields}

        if not updates:
            return False

        updates['updated_at'] = datetime.now().isoformat()

        # Convert lists to JSON strings
        for field in ['action_items', 'key_points', 'participants']:
            if field in updates:
                updates[field] = json.dumps(updates[field])

        set_clause = ', '.join(f"{k} = ?" for k in updates.keys())
        values = list(updates.values()) + [meeting_id]

        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                f"UPDATE meetings SET {set_clause} WHERE meeting_id = ?",
                values
            )
            conn.commit()
            return cursor.rowcount > 0

    def delete_meeting(self, meeting_id: str) -> bool:
        """Delete a meeting."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "DELETE FROM meetings WHERE meeting_id = ?",
                (meeting_id,)
            )
            conn.commit()
            return cursor.rowcount > 0

    def get_meeting_stats(self, user_id: str) -> dict:
        """Get meeting statistics for a user."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                """SELECT
                    COUNT(*) as total_meetings,
                    SUM(duration_minutes) as total_minutes,
                    AVG(duration_minutes) as avg_duration
                FROM meetings
                WHERE user_id = ?""",
                (user_id,)
            )
            row = cursor.fetchone()

            return {
                'total_meetings': row[0] or 0,
                'total_hours': round((row[1] or 0) / 60, 1),
                'avg_duration': round(row[2] or 0, 1)
            }
