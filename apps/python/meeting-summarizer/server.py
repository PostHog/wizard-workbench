#!/usr/bin/env python3
"""
AI Meeting Summarizer - Python Web Application
Automatically summarize meetings with AI-powered analysis.
"""

import atexit
import json
import logging
import signal
import sys
import os
import hashlib
import secrets
import uuid
from http.server import HTTPServer, BaseHTTPRequestHandler
from http.cookies import SimpleCookie
from urllib.parse import urlparse, parse_qs
from datetime import datetime, timedelta
from threading import Lock
import traceback
import mimetypes

from dotenv import load_dotenv
from posthog import Posthog

from database import UserDatabase
from models import User, Meeting
from ai_summarizer import AISummarizer

load_dotenv()


def _init_posthog():
    api_key = os.getenv('POSTHOG_KEY')
    if not api_key:
        logging.warning("PostHog not configured (POSTHOG_KEY not set). Analytics will not be tracked.")
        return None
    return Posthog(
        api_key,
        host=os.getenv('POSTHOG_HOST', 'https://us.i.posthog.com'),
        enable_exception_autocapture=True,
    )


posthog_client = _init_posthog()
if posthog_client:
    atexit.register(posthog_client.shutdown)


# Session management
class SessionManager:
    """Simple session management"""

    def __init__(self):
        self.sessions = {}
        self.lock = Lock()

    def create_session(self, user_id):
        """Create a new session"""
        with self.lock:
            session_id = secrets.token_urlsafe(32)
            self.sessions[session_id] = {
                'user_id': user_id,
                'created_at': datetime.now(),
                'last_accessed': datetime.now()
            }
            return session_id

    def get_session(self, session_id):
        """Get session data"""
        with self.lock:
            if session_id in self.sessions:
                session = self.sessions[session_id]
                # Check if session is expired (24 hours)
                if datetime.now() - session['last_accessed'] > timedelta(hours=24):
                    del self.sessions[session_id]
                    return None
                session['last_accessed'] = datetime.now()
                return session
            return None

    def delete_session(self, session_id):
        """Delete a session"""
        with self.lock:
            if session_id in self.sessions:
                del self.sessions[session_id]


class SaaSHandler(BaseHTTPRequestHandler):
    """HTTP request handler for the SaaS application"""

    db = UserDatabase()
    sessions = SessionManager()

    def _set_headers(self, status_code=200, content_type='text/html'):
        """Set response headers"""
        self.send_response(status_code)
        self.send_header('Content-Type', content_type)
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.end_headers()

    def _send_json(self, data, status_code=200):
        """Send JSON response"""
        self._set_headers(status_code, 'application/json')
        self.wfile.write(json.dumps(data, default=str).encode('utf-8'))

    def _parse_json_body(self):
        """Parse JSON request body"""
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            return {}
        body = self.rfile.read(content_length)
        return json.loads(body.decode('utf-8'))

    def _get_session_id(self):
        """Get session ID from cookie"""
        cookie_header = self.headers.get('Cookie')
        if cookie_header:
            cookie = SimpleCookie(cookie_header)
            if 'session_id' in cookie:
                return cookie['session_id'].value
        return None

    def _get_current_user(self):
        """Get current logged-in user"""
        session_id = self._get_session_id()
        if session_id:
            session = self.sessions.get_session(session_id)
            if session:
                return self.db.get_user(session['user_id'])
        return None

    def _serve_static_file(self, file_path):
        """Serve a static file"""
        try:
            static_dir = os.path.join(os.path.dirname(__file__), 'static')
            full_path = os.path.abspath(os.path.join(static_dir, file_path.lstrip('/')))

            if not full_path.startswith(static_dir):
                self._set_headers(403)
                self.wfile.write(b'Forbidden')
                return

            if not os.path.exists(full_path) or not os.path.isfile(full_path):
                self._set_headers(404)
                self.wfile.write(b'Not found')
                return

            content_type, _ = mimetypes.guess_type(full_path)
            if content_type is None:
                content_type = 'application/octet-stream'

            with open(full_path, 'rb') as f:
                content = f.read()

            self._set_headers(200, content_type)
            self.wfile.write(content)
        except Exception as e:
            logging.error(f"Error serving static file: {e}")
            self._set_headers(500)
            self.wfile.write(b'Internal server error')

    def do_GET(self):
        """Handle GET requests"""
        try:
            parsed_path = urlparse(self.path)
            path = parsed_path.path

            # Serve root
            if path == '/':
                user = self._get_current_user()
                if user:
                    self._serve_static_file('dashboard.html')
                else:
                    self._serve_static_file('login.html')
                return

            # API: Check auth status
            if path == '/api/auth/status':
                user = self._get_current_user()
                if user:
                    self._send_json({
                        'authenticated': True,
                        'user': {
                            'id': user.user_id,
                            'username': user.username,
                            'email': user.email,
                            'full_name': user.full_name
                        }
                    })
                else:
                    self._send_json({'authenticated': False})
                return

            # API: Get all users
            if path == '/api/users':
                user = self._get_current_user()
                if not user:
                    self._send_json({'error': 'Unauthorized'}, 401)
                    return

                users = self.db.list_users(active_only=False)
                self._send_json({
                    'users': [u.to_dict() for u in users],
                    'count': len(users)
                })
                return

            # API: Get specific user
            if path.startswith('/api/users/'):
                user = self._get_current_user()
                if not user:
                    self._send_json({'error': 'Unauthorized'}, 401)
                    return

                user_id = path.split('/')[-1]
                target_user = self.db.get_user(user_id)
                if target_user:
                    self._send_json(target_user.to_dict())
                else:
                    self._send_json({'error': 'User not found'}, 404)
                return

            # API: Get meetings
            if path == '/api/meetings':
                user = self._get_current_user()
                if not user:
                    self._send_json({'error': 'Unauthorized'}, 401)
                    return

                meetings = self.db.list_meetings(user.user_id)
                self._send_json({
                    'meetings': [m.to_dict() for m in meetings],
                    'count': len(meetings)
                })
                return

            # API: Get specific meeting
            if path.startswith('/api/meetings/'):
                user = self._get_current_user()
                if not user:
                    self._send_json({'error': 'Unauthorized'}, 401)
                    return

                meeting_id = path.split('/')[-1]
                meeting = self.db.get_meeting(meeting_id)
                if meeting and meeting.user_id == user.user_id:
                    self._send_json(meeting.to_dict())
                else:
                    self._send_json({'error': 'Meeting not found'}, 404)
                return

            # API: Get meeting statistics
            if path == '/api/stats':
                user = self._get_current_user()
                if not user:
                    self._send_json({'error': 'Unauthorized'}, 401)
                    return

                stats = self.db.get_meeting_stats(user.user_id)
                self._send_json(stats)
                return

            # Serve static files
            self._serve_static_file(path)

        except Exception as e:
            logging.error(f"Error in GET request: {e}\n{traceback.format_exc()}")
            if posthog_client:
                posthog_client.capture_exception(e)
            self._send_json({'error': 'Internal server error'}, 500)

    def do_POST(self):
        """Handle POST requests"""
        try:
            parsed_path = urlparse(self.path)
            path = parsed_path.path

            # API: Login
            if path == '/api/auth/login':
                data = self._parse_json_body()
                email = data.get('email')
                password = data.get('password')

                logging.info(f"Login attempt for: {email}")

                if not email or not password:
                    self._send_json({'error': 'Email and password required'}, 400)
                    return

                # Find user by email
                users = self.db.list_users()
                user = next((u for u in users if u.email == email), None)

                # Demo: any password works as long as user exists and is active
                if user and user.is_active:
                    logging.info(f"Login successful for: {email}")
                    # Create session
                    session_id = self.sessions.create_session(user.user_id)

                    if posthog_client:
                        posthog_client.capture(
                            distinct_id=user.user_id,
                            event='user_logged_in',
                            properties={
                                'username': user.username,
                                'has_full_name': bool(user.full_name),
                            },
                        )
                        posthog_client.set(
                            distinct_id=user.user_id,
                            properties={
                                'username': user.username,
                                'full_name': user.full_name,
                            },
                        )
                        posthog_client.set_once(
                            distinct_id=user.user_id,
                            properties={
                                'first_login_at': datetime.now().isoformat(),
                            },
                        )

                    # Send response with session cookie
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Set-Cookie', f'session_id={session_id}; Path=/; HttpOnly; SameSite=Lax')
                    self.end_headers()

                    response_data = json.dumps({
                        'success': True,
                        'user': {
                            'id': user.user_id,
                            'username': user.username,
                            'email': user.email
                        }
                    })
                    self.wfile.write(response_data.encode('utf-8'))
                else:
                    logging.warning(f"Login failed for: {email} (user {'found but inactive' if user else 'not found'})")
                    if posthog_client:
                        posthog_client.capture(
                            distinct_id=email,
                            event='user_login_failed',
                            properties={
                                'reason': 'user_not_found' if not user else 'user_inactive',
                            },
                        )
                    self._send_json({'error': 'User not found or inactive'}, 401)
                return

            # API: Logout
            if path == '/api/auth/logout':
                session_id = self._get_session_id()
                logout_user = self._get_current_user()
                if session_id:
                    self.sessions.delete_session(session_id)

                if posthog_client and logout_user:
                    posthog_client.capture(
                        distinct_id=logout_user.user_id,
                        event='user_logged_out',
                    )

                self._set_headers(200, 'application/json')
                self.send_header('Set-Cookie', 'session_id=; Path=/; HttpOnly; Max-Age=0')
                self.end_headers()

                self.wfile.write(json.dumps({'success': True}).encode('utf-8'))
                return

            # API: Create user
            if path == '/api/users':
                current_user = self._get_current_user()
                if not current_user:
                    self._send_json({'error': 'Unauthorized'}, 401)
                    return

                data = self._parse_json_body()

                if 'email' not in data or 'username' not in data:
                    self._send_json({'error': 'Email and username required'}, 400)
                    return

                user = User(
                    user_id=str(uuid.uuid4()),
                    email=data['email'],
                    username=data['username'],
                    full_name=data.get('full_name'),
                    created_at=datetime.now(),
                    updated_at=datetime.now(),
                    is_active=True,
                    metadata=data.get('metadata', {})
                )

                if self.db.create_user(user):
                    if posthog_client:
                        posthog_client.capture(
                            distinct_id=user.user_id,
                            event='user_registered',
                            properties={
                                'username': user.username,
                                'has_full_name': bool(user.full_name),
                                'created_by': current_user.user_id,
                            },
                        )
                    self._send_json(user.to_dict(), 201)
                else:
                    self._send_json({'error': 'User already exists'}, 409)
                return

            # API: Create meeting
            if path == '/api/meetings':
                current_user = self._get_current_user()
                if not current_user:
                    self._send_json({'error': 'Unauthorized'}, 401)
                    return

                data = self._parse_json_body()

                if 'title' not in data or 'transcript' not in data:
                    self._send_json({'error': 'Title and transcript required'}, 400)
                    return

                # Process transcript with AI
                transcript = data['transcript']
                summary, action_items, key_points, participants, duration = AISummarizer.analyze_transcript(transcript)

                # Create meeting
                meeting = Meeting(
                    meeting_id=str(uuid.uuid4()),
                    user_id=current_user.user_id,
                    title=data['title'],
                    transcript=transcript,
                    summary=summary,
                    action_items=action_items,
                    key_points=key_points,
                    participants=participants,
                    duration_minutes=duration,
                    created_at=datetime.now(),
                    updated_at=datetime.now()
                )

                if self.db.create_meeting(meeting):
                    if posthog_client:
                        posthog_client.capture(
                            distinct_id=current_user.user_id,
                            event='meeting_created',
                            properties={
                                'meeting_id': meeting.meeting_id,
                                'duration_minutes': meeting.duration_minutes,
                                'participant_count': len(meeting.participants),
                                'action_item_count': len(meeting.action_items),
                                'key_point_count': len(meeting.key_points),
                                'transcript_word_count': len(transcript.split()),
                            },
                        )
                    self._send_json(meeting.to_dict(), 201)
                else:
                    self._send_json({'error': 'Failed to create meeting'}, 500)
                return

            self._send_json({'error': 'Not found'}, 404)

        except json.JSONDecodeError:
            self._send_json({'error': 'Invalid JSON'}, 400)
        except Exception as e:
            logging.error(f"Error in POST request: {e}\n{traceback.format_exc()}")
            if posthog_client:
                posthog_client.capture_exception(e)
            self._send_json({'error': 'Internal server error'}, 500)

    def do_PUT(self):
        """Handle PUT requests"""
        try:
            parsed_path = urlparse(self.path)
            path = parsed_path.path

            # API: Update user
            if path.startswith('/api/users/'):
                current_user = self._get_current_user()
                if not current_user:
                    self._send_json({'error': 'Unauthorized'}, 401)
                    return

                user_id = path.split('/')[-1]
                data = self._parse_json_body()

                if self.db.update_user(user_id, **data):
                    updated_user = self.db.get_user(user_id)
                    self._send_json(updated_user.to_dict())
                else:
                    self._send_json({'error': 'User not found'}, 404)
                return

            self._send_json({'error': 'Not found'}, 404)

        except Exception as e:
            logging.error(f"Error in PUT request: {e}\n{traceback.format_exc()}")
            if posthog_client:
                posthog_client.capture_exception(e)
            self._send_json({'error': 'Internal server error'}, 500)

    def do_DELETE(self):
        """Handle DELETE requests"""
        try:
            parsed_path = urlparse(self.path)
            path = parsed_path.path

            # API: Delete user
            if path.startswith('/api/users/'):
                current_user = self._get_current_user()
                if not current_user:
                    self._send_json({'error': 'Unauthorized'}, 401)
                    return

                user_id = path.split('/')[-1]

                if self.db.delete_user(user_id):
                    if posthog_client:
                        posthog_client.capture(
                            distinct_id=current_user.user_id,
                            event='user_deleted',
                            properties={
                                'deleted_user_id': user_id,
                            },
                        )
                    self._send_json({'success': True})
                else:
                    self._send_json({'error': 'User not found'}, 404)
                return

            # API: Delete meeting
            if path.startswith('/api/meetings/'):
                current_user = self._get_current_user()
                if not current_user:
                    self._send_json({'error': 'Unauthorized'}, 401)
                    return

                meeting_id = path.split('/')[-1]
                meeting = self.db.get_meeting(meeting_id)

                # Ensure user owns this meeting
                if not meeting or meeting.user_id != current_user.user_id:
                    self._send_json({'error': 'Meeting not found'}, 404)
                    return

                if self.db.delete_meeting(meeting_id):
                    if posthog_client:
                        posthog_client.capture(
                            distinct_id=current_user.user_id,
                            event='meeting_deleted',
                            properties={
                                'meeting_id': meeting_id,
                            },
                        )
                    self._send_json({'success': True})
                else:
                    self._send_json({'error': 'Failed to delete meeting'}, 500)
                return

            self._send_json({'error': 'Not found'}, 404)

        except Exception as e:
            logging.error(f"Error in DELETE request: {e}\n{traceback.format_exc()}")
            if posthog_client:
                posthog_client.capture_exception(e)
            self._send_json({'error': 'Internal server error'}, 500)

    def log_message(self, format, *args):
        """Override to use logging module"""
        logging.info(f"{self.address_string()} - {format % args}")


def setup_logging():
    """Configure logging"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[logging.StreamHandler(sys.stdout)]
    )


def signal_handler(signum, frame):
    """Handle shutdown signals gracefully"""
    logging.info(f"Received signal {signum}, shutting down...")
    sys.exit(0)


def create_demo_users(db):
    """Create demo user and sample meetings if database is empty"""
    users = db.list_users()
    if len(users) == 0:
        logging.info("Creating demo user...")

        demo_user = User(
            user_id=str(uuid.uuid4()),
            email='demo@meetingsummarizer.ai',
            username='demo',
            full_name='Demo User',
            created_at=datetime.now(),
            updated_at=datetime.now(),
            is_active=True,
            metadata={'role': 'user'}
        )

        db.create_user(demo_user)
        logging.info(f"Created demo user: {demo_user.email}")

        # Create a sample meeting
        sample_transcript = """Sarah: Good morning everyone. Thanks for joining this product planning meeting.

John: Happy to be here. Should we start with the Q1 roadmap?

Sarah: Yes, let's do that. We need to finalize our priorities for the next quarter. The main focus should be on improving the user onboarding experience.

John: Agreed. I think we should also address the performance issues that customers have been reporting. We need to improve page load times by at least 40%.

Sarah: That's a good point. So we'll have two main priorities: onboarding improvements and performance optimization. John, can you lead the performance work?

John: Yes, I can do that. I'll need to work with the infrastructure team though.

Sarah: Perfect. I'll reach out to the infrastructure team today to coordinate. We should also schedule weekly check-ins to track progress.

John: Sounds good. When do we want to have the performance work completed?

Sarah: Let's target end of February. That gives us about 6 weeks.

John: That should be doable. I'll put together a detailed plan by next week.

Sarah: Excellent. Anything else we need to discuss today?

John: I think that covers it. I'll send out meeting notes within the hour.

Sarah: Great, thank you everyone."""

        summary, action_items, key_points, participants, duration = AISummarizer.analyze_transcript(sample_transcript)

        sample_meeting = Meeting(
            meeting_id=str(uuid.uuid4()),
            user_id=demo_user.user_id,
            title="Q1 Product Planning Meeting",
            transcript=sample_transcript,
            summary=summary,
            action_items=action_items,
            key_points=key_points,
            participants=participants,
            duration_minutes=duration,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        db.create_meeting(sample_meeting)
        logging.info("Created sample meeting")


def main():
    """Main entry point"""
    setup_logging()
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    # Create static directory if it doesn't exist
    static_dir = os.path.join(os.path.dirname(__file__), 'static')
    os.makedirs(static_dir, exist_ok=True)

    # Create demo users
    create_demo_users(SaaSHandler.db)

    # Configuration
    host = '0.0.0.0'
    port = 8000

    # Create and start server
    server = HTTPServer((host, port), SaaSHandler)
    logging.info(f"")
    logging.info(f"═══════════════════════════════════════════════════")
    logging.info(f"  AI Meeting Summarizer")
    logging.info(f"═══════════════════════════════════════════════════")
    logging.info(f"")
    logging.info(f"  Server running at: http://{host}:{port}")
    logging.info(f"")
    logging.info(f"  Demo account:")
    logging.info(f"    - demo@meetingsummarizer.ai")
    logging.info(f"    (any password works)")
    logging.info(f"")
    logging.info(f"═══════════════════════════════════════════════════")
    logging.info(f"")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        logging.info("Server stopped by user")
    finally:
        server.server_close()
        logging.info("Server shut down")


if __name__ == '__main__':
    main()
