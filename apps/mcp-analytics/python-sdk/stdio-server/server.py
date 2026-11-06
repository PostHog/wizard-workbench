from mcp.server.mcpserver import MCPServer

server = MCPServer("wb-python-stdio-server")
notes: list[str] = []


@server.tool()
def add_note(text: str) -> str:
    """Store a note"""
    notes.append(text)
    return f"{len(notes)} notes"


if __name__ == "__main__":
    server.run()
