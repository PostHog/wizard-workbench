from django.http import JsonResponse
from django.urls import path


def index(_request):
    return JsonResponse({'service': 'django', 'status': 'ok'})


urlpatterns = [path('', index)]
