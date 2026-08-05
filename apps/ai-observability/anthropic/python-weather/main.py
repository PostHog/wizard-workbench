"""Weather assistant on the Anthropic Python SDK. The model may call the
registered `get_weather` tool before answering, so one question is either one
model call or two with a tool execution between them."""

import os

import anthropic

from weather import get_weather

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))

MODEL = "claude-opus-5"

USER_ID = "user_123"

TOOLS = [
    {
        "name": "get_weather",
        "description": "Get the current weather for a given location.",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City and state, e.g. San Francisco, CA",
                }
            },
            "required": ["location"],
        },
    }
]

TOOL_CHOICE = {"type": "auto", "disable_parallel_tool_use": True}


def _text(response: anthropic.types.Message) -> str:
    return "".join(block.text for block in response.content if block.type == "text")


def ask(question: str) -> str:
    """Answer one question, running the tool if the model asks for it."""
    messages: list[dict] = [{"role": "user", "content": question}]

    response = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        tools=TOOLS,
        tool_choice=TOOL_CHOICE,
        messages=messages,
    )

    tool_use = next((b for b in response.content if b.type == "tool_use"), None)
    if tool_use is None:
        return _text(response)

    result = get_weather(**tool_use.input)

    messages += [
        {"role": "assistant", "content": response.content},
        {
            "role": "user",
            "content": [
                {"type": "tool_result", "tool_use_id": tool_use.id, "content": result}
            ],
        },
    ]

    followup = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        tools=TOOLS,
        tool_choice=TOOL_CHOICE,
        messages=messages,
    )
    return _text(followup)


def main() -> None:
    print(ask("What's the weather in San Francisco?"))


if __name__ == "__main__":
    main()
