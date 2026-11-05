from mcp.server.fastmcp import FastMCP

mcp = FastMCP("notes")
NOTES: dict[str, str] = {}


@mcp.tool()
def add_note(title: str, body: str) -> str:
    """Save a note under a title."""
    NOTES[title] = body
    return f"saved {title}"


@mcp.tool()
def get_note(title: str) -> str:
    """Read a saved note."""
    return NOTES.get(title, "not found")


def main() -> None:
    mcp.run()


if __name__ == "__main__":
    main()
