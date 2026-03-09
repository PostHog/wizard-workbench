#!/usr/bin/env python3
"""User Management Service - A pure Python background service for managing users."""

import atexit
import os
import uuid
from datetime import datetime
from typing import Optional

from dotenv import load_dotenv
from posthog import Posthog

from database import UserDatabase
from models import User

load_dotenv()


def _init_posthog():
    api_key = os.getenv('POSTHOG_PROJECT_API_KEY')
    if not api_key:
        return None
    client = Posthog(
        api_key,
        host=os.getenv('POSTHOG_HOST', 'https://us.i.posthog.com'),
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client


_posthog_client = _init_posthog()


class UserService:
    """Service for managing user lifecycle and operations."""

    def __init__(self):
        """Initialize the user service."""
        self.db = UserDatabase()
        self.service_id = str(uuid.uuid4())
        print(f"User service initialized (ID: {self.service_id})")

    def register_user(self, email: str, username: str, full_name: Optional[str] = None, metadata: Optional[dict] = None) -> Optional[User]:
        """Register a new user."""
        user_id = str(uuid.uuid4())
        now = datetime.now()

        user = User(
            user_id=user_id,
            email=email,
            username=username,
            full_name=full_name,
            created_at=now,
            updated_at=now,
            is_active=True,
            metadata=metadata
        )

        if self.db.create_user(user):
            print(f"✓ User registered: {username} ({email})")
            return user
        else:
            print(f"✗ Failed to register user: {username} (email or username already exists)")
            return None

    def get_user_profile(self, user_id: str) -> Optional[User]:
        """Get user profile by ID."""
        user = self.db.get_user(user_id)
        return user

    def update_user_profile(self, user_id: str, **updates) -> bool:
        """Update user profile."""
        success = self.db.update_user(user_id, **updates)

        if success:
            print(f"✓ User profile updated: {user_id}")
        else:
            print(f"✗ Failed to update user profile: {user_id}")

        return success

    def deactivate_user(self, user_id: str, reason: Optional[str] = None) -> bool:
        """Deactivate a user account."""
        success = self.db.deactivate_user(user_id)

        if success:
            print(f"✓ User deactivated: {user_id}")
            if _posthog_client:
                props = {}
                if reason:
                    props['reason'] = reason
                _posthog_client.capture(
                    distinct_id=user_id,
                    event='user_deactivated',
                    properties=props,
                )
        else:
            print(f"✗ Failed to deactivate user: {user_id}")

        return success

    def delete_user(self, user_id: str, reason: Optional[str] = None) -> bool:
        """Permanently delete a user account."""
        user = self.db.get_user(user_id)

        if user:
            success = self.db.delete_user(user_id)

            if success:
                print(f"✓ User deleted: {user_id}")
                return True

        print(f"✗ Failed to delete user: {user_id}")
        return False

    def list_all_users(self, active_only: bool = False):
        """List all users in the system."""
        users = self.db.list_users(active_only=active_only)
        return users

    def export_users(self, active_only: bool = False) -> list:
        """Export all users as dictionaries."""
        users = self.db.list_users(active_only=active_only)
        return [user.to_dict() for user in users]

    def shutdown(self):
        """Shutdown the service gracefully."""
        print(f"Service {self.service_id} shutting down...")


def main():
    """Main entry point for the user service."""
    print("=" * 60)
    print("User Management Service")
    print("=" * 60)

    # Initialize service
    service = UserService()

    # Example usage: Register some test users
    print("\n--- Registering Test Users ---")

    user1 = service.register_user(
        email="alice@example.com",
        username="alice",
        full_name="Alice Smith",
        metadata={'role': 'admin', 'department': 'engineering'}
    )

    user2 = service.register_user(
        email="bob@example.com",
        username="bob",
        full_name="Bob Johnson",
        metadata={'role': 'user', 'department': 'marketing'}
    )

    user3 = service.register_user(
        email="charlie@example.com",
        username="charlie"
    )

    # List all users
    print("\n--- Listing All Users ---")
    users = service.list_all_users()
    print(f"Total users: {len(users)}")
    for user in users:
        status = "Active" if user.is_active else "Inactive"
        print(f"  - {user.username} ({user.email}) - {status}")

    # Update a user
    if user1:
        print("\n--- Updating User Profile ---")
        service.update_user_profile(
            user1.user_id,
            full_name="Alice M. Smith",
            metadata={'role': 'admin', 'department': 'engineering', 'title': 'Senior Engineer'}
        )

    # Deactivate a user
    if user3:
        print("\n--- Deactivating User ---")
        service.deactivate_user(user3.user_id, reason="User requested account suspension")

    # List active users only
    print("\n--- Listing Active Users ---")
    active_users = service.list_all_users(active_only=True)
    print(f"Active users: {len(active_users)}")
    for user in active_users:
        print(f"  - {user.username} ({user.email})")

    # Export users
    print("\n--- Exporting Users ---")
    exported = service.export_users()
    print(f"Exported {len(exported)} users")

    # Shutdown
    print("\n--- Shutting Down Service ---")
    service.shutdown()
    print("Service stopped.")


if __name__ == "__main__":
    main()
