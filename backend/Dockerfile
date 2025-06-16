
FROM php:8.2-fpm


RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Cài Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy project files
COPY . .


RUN composer install --no-dev --optimize-autoloader


RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache


EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=8000