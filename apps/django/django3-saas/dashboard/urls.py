from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('', views.index, name='index'),
    path('projects/', views.projects, name='projects'),
    path('projects/create/', views.create_project, name='create_project'),
    path('projects/<int:pk>/edit/', views.edit_project, name='edit_project'),
    path('projects/<int:pk>/delete/', views.delete_project, name='delete_project'),
]
