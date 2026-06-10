from config.posthog import posthog


class PostHogExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        user = getattr(request, 'user', None)
        distinct_id = str(user.id) if user and user.is_authenticated else 'anonymous'
        posthog.capture_exception(exception, distinct_id)
