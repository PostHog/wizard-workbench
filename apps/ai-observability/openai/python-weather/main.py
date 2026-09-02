"""Weather assistant on the OpenAI Python SDK. The model may call the
registered `get_weather` tool before answering, so one question is either one
model call or two with a tool execution between them."""

import atexit
import json
import os
import time
import uuid

from posthog import Posthog
from posthog.ai.openai import OpenAI

from weather import get_weather

posthog_client = Posthog(
    os.environ["POSTHOG_PROJECT_API_KEY"],
    host=os.environ["POSTHOG_HOST"],
    enable_exception_autocapture=True,
)
atexit.register(posthog_client.shutdown)

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY", ""),
    posthog_client=posthog_client,
)

MODEL = "gpt-5-mini"

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather for a given location.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City and state, e.g. San Francisco, CA",
                    }
                },
                "required": ["location"],
            },
        },
    }
]


class Conversation:
    """One chat thread. Every question asked below belongs to this thread."""

    def __init__(self, user_id: str, thread_id: str) -> None:
        self.user_id = user_id
        self.thread_id = thread_id
        self.messages: list[dict] = []

    def ask(self, question: str) -> str:
        """Answer one question, running the tool if the model asks for it."""
        self.messages.append({"role": "user", "content": question})

        trace_id = str(uuid.uuid4())
        posthog_properties = {"$ai_session_id": self.thread_id}

        response = client.chat.completions.create(
            model=MODEL,
            messages=self.messages,
            tools=TOOLS,
            parallel_tool_calls=False,
            posthog_distinct_id=self.user_id,
            posthog_trace_id=trace_id,
            posthog_properties=posthog_properties,
        )
        message = response.choices[0].message

        if not message.tool_calls:
            self.messages.append({"role": "assistant", "content": message.content or ""})
            return message.content or ""

        call = message.tool_calls[0]
        args = json.loads(call.function.arguments)
        tool_start = time.time()
        result = get_weather(**args)
        posthog_client.capture(
            distinct_id=self.user_id,
            event="$ai_span",
            properties={
                "$ai_trace_id": trace_id,
                "$ai_session_id": self.thread_id,
                "$ai_span_id": str(uuid.uuid4()),
                "$ai_span_name": call.function.name,
                "$ai_input_state": call.function.arguments,
                "$ai_output_state": result,
                "$ai_latency": time.time() - tool_start,
            },
        )

        self.messages.append(message)
        self.messages.append(
            {"role": "tool", "tool_call_id": call.id, "content": result}
        )

        followup = client.chat.completions.create(
            model=MODEL,
            messages=self.messages,
            tools=TOOLS,
            parallel_tool_calls=False,
            posthog_distinct_id=self.user_id,
            posthog_trace_id=trace_id,
            posthog_properties=posthog_properties,
        )
        answer = followup.choices[0].message.content or ""
        self.messages.append({"role": "assistant", "content": answer})
        return answer


def main() -> None:
    thread = Conversation(user_id="user_123", thread_id="thread_abc")
    print(thread.ask("What's the weather in San Francisco?"))
    print(thread.ask("How about Boston?"))


if __name__ == "__main__":
    main()
