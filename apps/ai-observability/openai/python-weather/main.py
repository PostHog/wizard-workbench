"""Weather assistant on the OpenAI Python SDK. The model may call the
registered `get_weather` tool before answering, so one question is either one
model call or two with a tool execution between them."""

import json
import os

import openai

from weather import get_weather

client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY", ""))

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

        response = client.chat.completions.create(
            model=MODEL,
            messages=self.messages,
            tools=TOOLS,
            parallel_tool_calls=False,
        )
        message = response.choices[0].message

        if not message.tool_calls:
            self.messages.append({"role": "assistant", "content": message.content or ""})
            return message.content or ""

        call = message.tool_calls[0]
        args = json.loads(call.function.arguments)
        result = get_weather(**args)

        self.messages.append(message)
        self.messages.append(
            {"role": "tool", "tool_call_id": call.id, "content": result}
        )

        followup = client.chat.completions.create(
            model=MODEL,
            messages=self.messages,
            tools=TOOLS,
            parallel_tool_calls=False,
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
