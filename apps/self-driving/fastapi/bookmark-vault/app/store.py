"""In-memory bookmark store. Everything resets when the server restarts."""

from dataclasses import dataclass, field
from datetime import datetime, timezone
from itertools import count


@dataclass
class Bookmark:
    id: int
    url: str
    title: str
    tags: list[str] = field(default_factory=list)
    archived: bool = False
    visits: int = 0
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


_ids = count(4)

_bookmarks: list[Bookmark] = [
    Bookmark(id=1, url="https://astro.build", title="Astro docs", tags=["docs", "web"], visits=9),
    Bookmark(id=2, url="https://fastapi.tiangolo.com", title="FastAPI docs", tags=["docs", "python"], visits=14),
    Bookmark(id=3, url="https://news.ycombinator.com", title="Hacker News", tags=["news"], visits=48, archived=True),
]


def list_bookmarks(include_archived: bool = True) -> list[Bookmark]:
    if include_archived:
        return _bookmarks
    return [bookmark for bookmark in _bookmarks if not bookmark.archived]


def find_bookmark(bookmark_id: int) -> Bookmark | None:
    return next((bookmark for bookmark in _bookmarks if bookmark.id == bookmark_id), None)


def add_bookmark(url: str, title: str, tags: list[str] | None = None) -> Bookmark:
    bookmark = Bookmark(id=next(_ids), url=url, title=title, tags=tags or [])
    _bookmarks.append(bookmark)
    return bookmark


def visit_bookmark(bookmark_id: int) -> Bookmark | None:
    bookmark = find_bookmark(bookmark_id)
    if bookmark is None:
        return None

    bookmark.visits += 1
    return bookmark


def set_archived(bookmark_id: int, archived: bool) -> Bookmark | None:
    bookmark = find_bookmark(bookmark_id)
    if bookmark is None:
        return None

    bookmark.archived = archived
    return bookmark


def delete_bookmark(bookmark_id: int) -> bool:
    bookmark = find_bookmark(bookmark_id)
    if bookmark is None:
        return False

    _bookmarks.remove(bookmark)
    return True
