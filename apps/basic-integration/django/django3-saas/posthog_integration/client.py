from django.apps import apps


def capture(event, *, properties=None, distinct_id=None):
    client = apps.get_app_config('posthog_integration').posthog_client
    if client is None:
        return

    kwargs = {'properties': properties}
    if distinct_id is not None:
        kwargs['distinct_id'] = distinct_id
    client.capture(event, **kwargs)
