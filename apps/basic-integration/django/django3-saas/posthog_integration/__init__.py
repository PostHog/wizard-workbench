"""Shared PostHog integration package."""


class _NoopPosthog:
    def capture(self, *args, **kwargs):
        return None


client = _NoopPosthog()
