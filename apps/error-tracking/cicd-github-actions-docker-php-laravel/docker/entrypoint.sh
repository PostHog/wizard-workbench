#!/bin/sh
# Cache the configuration from the container's environment, then hand off to
# php-fpm. Once the config is cached, Laravel no longer reads .env.
set -e
php artisan config:cache
php artisan route:cache
exec "$@"
