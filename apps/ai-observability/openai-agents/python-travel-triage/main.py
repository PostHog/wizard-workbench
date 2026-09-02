"""Travel desk on the OpenAI Agents SDK: a triage agent hands off to a booking
agent that has one tool."""

import atexit
import os
import uuid

from agents import Agent, Runner, RunConfig, function_tool
from posthog import Posthog
from posthog.ai.openai_agents import instrument

posthog = Posthog(
    os.environ["POSTHOG_API_KEY"],
    host=os.environ["POSTHOG_HOST"],
    enable_exception_autocapture=True,
)
atexit.register(posthog.shutdown)
instrument(
    client=posthog,
    distinct_id=lambda trace: (trace.metadata or {}).get("posthog_distinct_id"),
)


@function_tool
def get_flight_price(origin: str, destination: str) -> str:
    """Look up the cheapest fare between two cities."""
    return f"Cheapest {origin} to {destination} fare is $312, departing Thursday."


booking_agent = Agent(
    name="BookingAgent",
    instructions="You quote flight prices. Always use get_flight_price.",
    tools=[get_flight_price],
)

triage_agent = Agent(
    name="TriageAgent",
    instructions="Route flight pricing questions to the booking agent.",
    handoffs=[booking_agent],
)


def main() -> None:
    result = Runner.run_sync(
        triage_agent,
        "How much is a flight from Boston to Lisbon?",
        run_config=RunConfig(group_id=f"run-{uuid.uuid4()}"),
    )
    print(result.final_output)


if __name__ == "__main__":
    main()
