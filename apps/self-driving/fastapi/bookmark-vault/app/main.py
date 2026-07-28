from pathlib import Path

from fastapi import FastAPI, Form, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from app import store

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="Bookmark Vault")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


@app.get("/", response_class=HTMLResponse)
def index(request: Request, show_archived: bool = False):
    bookmarks = store.list_bookmarks(include_archived=show_archived)
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"bookmarks": bookmarks, "show_archived": show_archived},
    )


@app.get("/about", response_class=HTMLResponse)
def about(request: Request):
    return templates.TemplateResponse(request=request, name="about.html", context={})


@app.post("/bookmarks")
def create_bookmark(url: str = Form(...), title: str = Form(...), tags: str = Form("")):
    if not url.startswith("http"):
        raise HTTPException(status_code=400, detail="url must start with http")

    store.add_bookmark(
        url=url.strip(),
        title=title.strip() or url.strip(),
        tags=[tag.strip() for tag in tags.split(",") if tag.strip()],
    )
    return RedirectResponse("/", status_code=303)


@app.post("/bookmarks/{bookmark_id}/visit")
def visit_bookmark(bookmark_id: int):
    bookmark = store.visit_bookmark(bookmark_id)
    if bookmark is None:
        raise HTTPException(status_code=404, detail="bookmark not found")

    return RedirectResponse(bookmark.url, status_code=303)


@app.post("/bookmarks/{bookmark_id}/archive")
def archive_bookmark(bookmark_id: int, archived: bool = Form(True)):
    if store.set_archived(bookmark_id, archived) is None:
        raise HTTPException(status_code=404, detail="bookmark not found")

    return RedirectResponse("/", status_code=303)


@app.post("/bookmarks/{bookmark_id}/delete")
def delete_bookmark(bookmark_id: int):
    if not store.delete_bookmark(bookmark_id):
        raise HTTPException(status_code=404, detail="bookmark not found")

    return RedirectResponse("/", status_code=303)


@app.get("/api/bookmarks")
def api_list_bookmarks():
    return store.list_bookmarks()
