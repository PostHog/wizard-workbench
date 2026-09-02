"""Weather assistant on the Anthropic Python SDK. The model may call the
registered `get_weather` tool before answering, so one question is either one
model call or two with a tool execution between them."""

import atexit
import os
import time
import uuid

import anthropic
from posthog import Posthog
from posthog.ai.anthropic import Anthropic

from weather import get_weather

posthog = Posthog(os.environ["POSTHOG_API_KEY"], host=os.environ["POSTHOG_HOST"])
atexit.register(posthog.shutdown)

client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""), posthog_client=posthog)

MODEL = "claude-opus-5"

USER_ID = "user_123"
SESSION_ID = str(uuid.uuid4())

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
    trace_id = str(uuid.uuid4())
    messages: list[dict] = [{"role": "user", "content": question}]

    response = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        tools=TOOLS,
        tool_choice=TOOL_CHOICE,
        messages=messages,
        posthog_distinct_id=USER_ID,
        posthog_trace_id=trace_id,
        posthog_properties={"$ai_session_id": SESSION_ID},
    )

    tool_use = next((b for b in response.content if b.type == "tool_use"), None)
    if tool_use is None:
        return _text(response)

    start = time.time()
    result = get_weather(**tool_use.input)
    posthog.capture(
        distinct_id=USER_ID,
        event="$ai_span",
        properties={
            "$ai_trace_id": trace_id,
            "$ai_session_id": SESSION_ID,
            "$ai_span_id": str(uuid.uuid4()),
            "$ai_span_name": tool_use.name,
            "$ai_input_state": tool_use.input,
            "$ai_output_state": result,
            "$ai_latency": time.time() - start,
        },
    )

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
        posthog_distinct_id=USER_ID,
        posthog_trace_id=trace_id,
        posthog_properties={"$ai_session_id": SESSION_ID},
    )
    return _text(followup)


def main() -> None:
    print(ask("What's the weather in San Francisco?"))


if __name__ == "__main__":
    main()
