from django.urls import path
from . import views

app_name = 'marketing'

urlpatterns = [
    path('', views.home, name='home'),
    path('features/', views.features, name='features'),
]
