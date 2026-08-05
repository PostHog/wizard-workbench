"""Backing implementation for the `get_weather` tool. No model call involved."""

_FORECAST = {
    "San Francisco, CA": "15 degrees Celsius, partly cloudy",
    "Boston, MA": "4 degrees Celsius, snow showers",
}


def get_weather(location: str) -> str:
    return _FORECAST.get(location, f"No forecast on file for {location}.")
