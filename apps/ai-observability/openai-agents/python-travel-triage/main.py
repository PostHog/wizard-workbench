"""Travel desk on the OpenAI Agents SDK: a triage agent hands off to a booking
agent that has one tool."""

from os import environ
from uuid import uuid4

from agents import Agent, RunConfig, Runner, function_tool
from posthog import Posthog
from posthog.ai.openai_agents import instrument


posthog_client = Posthog(
    environ["POSTHOG_PROJECT_TOKEN"],
    host=environ["POSTHOG_HOST"],
    enable_exception_autocapture=True,
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
    session_id = f"travel-triage-{uuid4()}"
    instrument(
        client=posthog_client,
        privacy_mode=False,
        properties={"$ai_session_id": session_id},
    )
    result = Runner.run_sync(
        triage_agent,
        "How much is a flight from Boston to Lisbon?",
        run_config=RunConfig(group_id=session_id),
    )
    print(result.final_output)


if __name__ == "__main__":
    try:
        main()
    finally:
        posthog_client.shutdown()
