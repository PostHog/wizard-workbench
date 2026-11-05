import signal

from mcp.server.fastmcp import FastMCP
from posthog.mcp import instrument

from .posthog_client import posthog_client as _posthog_client
from .posthog_logs import posthog_logger

mcp = FastMCP("notes")
analytics = instrument(mcp, _posthog_client) if _posthog_client else None


def _stop(*_: object) -> None:
    raise SystemExit(0)


signal.signal(signal.SIGTERM, _stop)
NOTES: dict[str, str] = {}


@mcp.tool()
def add_note(title: str, body: str) -> str:
    """Save a note under a title."""
    NOTES[title] = body
    if _posthog_client:
        _posthog_client.capture(
            event="note_saved",
            properties={"note_count": len(NOTES)},
        )
    posthog_logger.info("note saved", extra={"event": "note_saved", "note_count": len(NOTES)})
    return f"saved {title}"


@mcp.tool()
def get_note(title: str) -> str:
    """Read a saved note."""
    note = NOTES.get(title)
    if _posthog_client:
        _posthog_client.capture(
            event="note_lookup_completed",
            properties={"note_found": note is not None},
        )
    posthog_logger.info(
        "note lookup completed",
        extra={"event": "note_lookup_completed", "note_found": note is not None},
    )
    return note if note is not None else "not found"


def main() -> None:
    mcp.run()


if __name__ == "__main__":
    main()
