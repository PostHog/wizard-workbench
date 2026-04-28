# Acme AI

An AI content generation SaaS built with FastAPI.

## Running the app

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload
```

Visit http://localhost:8000

## Application Structure

```
app/
├── main.py              # FastAPI app, lifespan, error handlers
├── config.py            # Pydantic Settings
├── database.py          # SQLAlchemy setup
├── models.py            # User, APIKey, Generation, Activity
├── dependencies.py      # Auth dependencies
├── middleware.py        # Custom middleware
├── routers/
│   ├── auth.py          # Login, signup, logout
│   ├── generate.py      # AI generation API
│   ├── api_keys.py      # API key management
│   ├── usage.py         # Usage statistics
│   ├── settings.py      # User settings
│   └── pages.py         # Web pages (dashboard, home)
└── templates/           # Jinja2 templates
    ├── base.html
    ├── home.html
    ├── login.html
    ├── signup.html
    ├── dashboard.html
    ├── settings.html
    ├── 404.html
    └── 500.html
```

## Features

- **Authentication**: Cookie-based sessions, signup/login/logout
- **Credit System**: 100 free credits, consumed by AI generation
- **AI Generation**: Blog posts (10), emails (5), social posts (2 credits)
- **API Keys**: Create, list, revoke API keys (up to 5 per user)
- **Usage Stats**: Track generations and credit usage
- **Settings**: Update email, change password
- **Activity Log**: Track user actions
- **Dashboard**: Stats, recent generations, quick actions

## API Endpoints

### Authentication
- `POST /signup` - Create account
- `POST /login` - Login
- `GET /logout` - Logout

### AI Generation
- `POST /api/generate` - Generate content (requires auth)
- `GET /api/credits` - Get credit balance

### API Keys
- `GET /api/keys` - List API keys
- `POST /api/keys` - Create API key
- `DELETE /api/keys/{id}` - Revoke API key

### Usage
- `GET /api/usage` - Get usage statistics

### Pages
- `GET /` - Home page
- `GET /dashboard` - User dashboard
- `GET /settings` - Account settings

## Models

| Model | Description |
|-------|-------------|
| User | Account with email, password, credits |
| APIKey | API key for programmatic access |
| Generation | Record of content generation |
| Activity | Activity log for user actions |
