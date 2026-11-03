import asyncio
import os

from mcp.server.mcpserver import MCPServer
from posthog import Posthog
from posthog.mcp import instrument

posthog = Posthog(
    os.environ["POSTHOG_PROJECT_TOKEN"],
    host=os.environ["POSTHOG_HOST"],
)
server = MCPServer("wb-python-stdio-server")
analytics = instrument(server, posthog)
notes: list[str] = []


@server.tool()
def add_note(text: str) -> str:
    """Store a note"""
    notes.append(text)
    return f"{len(notes)} notes"


if __name__ == "__main__":
    try:
        server.run()
    finally:
        asyncio.run(analytics.flush())
        posthog.shutdown()
