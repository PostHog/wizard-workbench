from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('billing/', include('billing.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('', include('marketing.urls')),
]

handler404 = 'config.views.handler404'
handler500 = 'config.views.handler500'
