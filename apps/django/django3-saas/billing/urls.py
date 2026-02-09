from django.urls import path
from . import views

app_name = 'billing'

urlpatterns = [
    path('pricing/', views.pricing, name='pricing'),
    path('subscribe/<slug:plan_slug>/', views.subscribe, name='subscribe'),
    path('success/', views.success, name='success'),
    path('manage/', views.manage, name='manage'),
    path('change-plan/<slug:plan_slug>/', views.change_plan, name='change_plan'),
    path('cancel/', views.cancel, name='cancel'),
    path('portal/', views.billing_portal, name='billing_portal'),
    path('webhook/', views.webhook, name='webhook'),
]
