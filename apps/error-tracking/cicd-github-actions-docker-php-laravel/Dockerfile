# Install the Composer dependencies in a throwaway stage.
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction
COPY . .
RUN composer dump-autoload --optimize --classmap-authoritative --no-dev

FROM php:8.4-fpm-alpine
WORKDIR /var/www/html
RUN docker-php-ext-install opcache
COPY docker/php-fpm/zz-app.conf /usr/local/etc/php-fpm.d/zz-app.conf
COPY docker/entrypoint.sh /usr/local/bin/app-entrypoint
COPY --from=vendor --chown=www-data:www-data /app /var/www/html
ENTRYPOINT ["app-entrypoint"]
CMD ["php-fpm"]
