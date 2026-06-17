import os


def posthog(request):
    return {
        'POSTHOG_PUBLIC_TOKEN': os.environ.get('POSTHOG_PUBLIC_TOKEN', ''),
        'POSTHOG_HOST': os.environ.get('POSTHOG_HOST', ''),
    }
