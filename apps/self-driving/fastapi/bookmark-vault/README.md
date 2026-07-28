# Bookmark Vault (FastAPI)

A bookmark manager built with FastAPI and server-rendered Jinja templates, backed by an in-memory
store. No analytics — this app is a clean target for the PostHog wizard.

## Features

- Save a bookmark with a title and comma-separated tags
- Open a bookmark, which counts the visit and redirects
- Archive, unarchive, and delete bookmarks
- Toggle archived bookmarks in and out of the list
- A small JSON endpoint alongside the HTML pages

## Tech stack

- FastAPI
- Jinja2 templates
- Uvicorn
- Python 3.11+ (uses `X | None` type syntax)

## Getting started

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open http://localhost:8000.

## Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Bookmark list, optionally `?show_archived=true` |
| `GET` | `/about` | Static about page |
| `POST` | `/bookmarks` | Create a bookmark from the form |
| `POST` | `/bookmarks/{id}/visit` | Count a visit and redirect to the URL |
| `POST` | `/bookmarks/{id}/archive` | Archive or unarchive — form field `archived` |
| `POST` | `/bookmarks/{id}/delete` | Delete a bookmark |
| `GET` | `/api/bookmarks` | JSON list of all bookmarks |

## Project structure

```
app/
├── main.py                   # Routes and form handlers
├── store.py                  # In-memory bookmark store
└── templates/
    ├── base.html             # Shell and styles
    ├── index.html            # Bookmark list and add form
    └── about.html
requirements.txt
```

## Notes

- Data lives in memory and resets on every server restart
- Seeded with three bookmarks, one of them archived
