from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-test-fixture'
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = ['django.contrib.contenttypes', 'django.contrib.auth']
MIDDLEWARE = ['django.middleware.common.CommonMiddleware']
ROOT_URLCONF = 'config.urls'
TEMPLATES = []
WSGI_APPLICATION = 'config.wsgi.application'
DATABASES = {}
USE_TZ = True
