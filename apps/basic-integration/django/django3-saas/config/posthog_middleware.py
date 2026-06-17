import traceback

from .posthog_client import posthog


class PostHogExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        distinct_id = (
            str(request.user.pk)
            if hasattr(request, 'user') and request.user.is_authenticated
            else 'anonymous'
        )
        posthog.capture(
            distinct_id,
            '$exception',
            {
                '$exception_type': type(exception).__name__,
                '$exception_message': str(exception),
                '$exception_stack_trace_raw': traceback.format_exc(),
            },
        )
        return None
