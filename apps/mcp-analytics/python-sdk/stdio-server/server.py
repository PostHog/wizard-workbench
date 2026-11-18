import asyncio
import os
import signal
import threading

from mcp.server.mcpserver import MCPServer
from posthog import Posthog
from posthog.mcp import instrument

posthog = Posthog(
    os.environ.get("POSTHOG_PROJECT_TOKEN"),
    host=os.environ.get("POSTHOG_HOST"),
)
server = MCPServer("wb-python-stdio-server")
analytics = instrument(server, posthog)
notes: list[str] = []


def stop(*_: object) -> None:
    thread = threading.Thread(target=posthog.shutdown, daemon=True)
    thread.start()
    thread.join(3)
    os._exit(0)


signal.signal(signal.SIGTERM, stop)


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
