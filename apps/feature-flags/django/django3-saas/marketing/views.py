from django.shortcuts import render


def home(request):
    """Landing page for the SaaS application."""
    return render(request, 'marketing/home.html')


def features(request):
    """Features page showcasing product capabilities."""
    return render(request, 'marketing/features.html')
