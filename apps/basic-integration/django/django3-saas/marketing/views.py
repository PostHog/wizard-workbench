from posthog import new_context, identify_context, capture

from django.shortcuts import render


def home(request):
    """Landing page for the SaaS application."""
    user_id = str(request.user.id) if request.user.is_authenticated else 'anonymous'
    with new_context():
        if request.user.is_authenticated:
            identify_context(user_id)
        capture('marketing_home_viewed', properties={
            'is_authenticated': request.user.is_authenticated,
        })
    return render(request, 'marketing/home.html')


def features(request):
    """Features page showcasing product capabilities."""
    return render(request, 'marketing/features.html')
