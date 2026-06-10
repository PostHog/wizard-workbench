import traceback
from config.posthog import posthog


class PostHogExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        distinct_id = (
            str(request.user.id)
            if request.user.is_authenticated
            else request.session.session_key or "anonymous"
        )
        posthog.capture_exception(exception, distinct_id)
        return None
