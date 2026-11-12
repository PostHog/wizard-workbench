import asyncio
import os
import signal
import sys
import threading

from mcp.server.mcpserver import MCPServer
from posthog import Posthog
from posthog.mcp import instrument

project_token = os.environ.get("POSTHOG_PROJECT_TOKEN")
if not project_token:
    print("POSTHOG_PROJECT_TOKEN is not set; MCP analytics is disabled.", file=sys.stderr)

posthog = Posthog(project_token, host=os.environ.get("POSTHOG_HOST"))
server = MCPServer("wb-python-stdio-server")
analytics = instrument(server, posthog)
notes: list[str] = []


def stop(*_):
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
