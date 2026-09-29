# Shop API

Laravel 12 API.

## Development

```bash
composer run setup
composer run dev     # php artisan serve
php artisan test
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`: it builds the
`php:8.4-fpm-alpine` image from `Dockerfile`, pushes it to GHCR, copies
`docker-compose.prod.yml` to the server, and rolls out the php-fpm + nginx
stack over SSH. The server keeps the app's secrets in `/srv/shop/app.env`. The
container caches the config at start (`docker/entrypoint.sh`), and the pool
override `docker/php-fpm/zz-app.conf` keeps the container environment away from
the workers except for the variables it lists.
