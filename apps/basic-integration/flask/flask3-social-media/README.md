# Microblog

A full-featured social media microblogging platform built with Flask 3. Users can post short messages, follow other users, send private messages, and more.

## Running the App

### Prerequisites

- Python 3.10+
- SQLite (included with Python, used by default)
- Redis (optional)
- Elasticsearch (optional)

### Installation

1. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables (create a `.env` file):

```bash
SECRET_KEY=your-secret-key
# DATABASE_URL=postgresql://...  # Optional, defaults to SQLite (app.db)
MAIL_SERVER=smtp.example.com     # Optional
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
REDIS_URL=redis://localhost:6379      # Optional
ELASTICSEARCH_URL=http://localhost:9200  # Optional
```

> **Note:** By default, the app uses SQLite (`app.db` in the project root). No database setup is required for local development.

4. Initialize the database:

```bash
flask db upgrade
```

5. Run the development server:

```bash
flask run
```

The app will be available at `http://localhost:5000`.

### Docker Deployment

The app includes a `Dockerfile` and `boot.sh` script for containerized deployment using Gunicorn.

---

## Application Structure

```
├── microblog.py          # Application entry point
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── app/
│   ├── __init__.py       # App factory and extension initialization
│   ├── models.py         # SQLAlchemy database models
│   ├── search.py         # Elasticsearch integration
│   ├── tasks.py          # Background task definitions (RQ)
│   ├── email.py          # Email sending utilities
│   ├── translate.py      # Translation service integration
│   ├── cli.py            # Custom CLI commands
│   ├── api/              # REST API blueprint
│   │   ├── auth.py       # Token authentication
│   │   ├── users.py      # User endpoints
│   │   ├── tokens.py     # Token management
│   │   └── errors.py     # API error handlers
│   ├── auth/             # Authentication blueprint
│   │   ├── routes.py     # Login, register, password reset
│   │   ├── forms.py      # WTForms definitions
│   │   └── email.py      # Auth-related emails
│   ├── main/             # Main application blueprint
│   │   ├── routes.py     # Homepage, user profiles, posts, messaging
│   │   └── forms.py      # Post and profile forms
│   ├── errors/           # Error handling blueprint
│   │   └── handlers.py   # 404, 500 error pages
│   ├── templates/        # Jinja2 templates
│   └── translations/     # i18n message catalogs (en, es)
└── migrations/           # Alembic database migrations
```

## Features

### User System
- Registration with email validation
- Login/logout with Flask-Login session management
- Password reset via email (JWT tokens)
- User profiles with avatars (Gravatar)
- "About me" bios and last seen timestamps

### Social Features
- Create short posts (140 characters)
- Follow/unfollow other users
- Timeline feed showing posts from followed users
- Private messaging between users
- Real-time notifications

### API
- RESTful API at `/api/` with token-based authentication
- Endpoints for user CRUD, followers, and following lists
- Paginated responses with hypermedia links

### Search
- Full-text search powered by Elasticsearch (optional)
- Automatic indexing of posts on create/update/delete

### Background Tasks
- Redis Queue (RQ) for async job processing
- Export posts feature runs as background task

### Internationalization
- Multi-language support via Flask-Babel
- English and Spanish translations included
- Language auto-detection from browser preferences

## Database Models

| Model | Description |
|-------|-------------|
| `User` | User accounts with authentication, profiles, and social relationships |
| `Post` | Short text posts with timestamps and language detection |
| `Message` | Private messages between users |
| `Notification` | Real-time notification payloads |
| `Task` | Background task tracking for RQ jobs |

## Key Dependencies

- **Flask** - Web framework
- **Flask-SQLAlchemy** - Database ORM (SQLite by default, PostgreSQL supported)
- **Flask-Migrate** - Database migrations (Alembic)
- **Flask-Login** - User session management
- **Flask-WTF** - Form handling and CSRF protection
- **Flask-Mail** - Email sending
- **Flask-Babel** - Internationalization
- **Flask-Moment** - Client-side timestamp formatting
- **Flask-HTTPAuth** - API authentication
- **PyJWT** - JSON Web Tokens for password reset
- **Redis / RQ** - Background task queue
- **Elasticsearch** - Full-text search
