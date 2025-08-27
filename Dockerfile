# Beehive Group Website - Docker Configuration

# Use official PHP with Apache base image
FROM php:8.2-apache

# Set maintainer
LABEL maintainer="Beehive Group <dev@beehivegroup.com>"
LABEL description="Modern, elegant website for Beehive Group services"

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    curl \
    nano \
    && docker-php-ext-install zip \
    && docker-php-ext-enable zip \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache modules
RUN a2enmod rewrite headers expires deflate

# Set working directory
WORKDIR /var/www/html

# Copy website files
COPY . /var/www/html/

# Create images directory with proper permissions
RUN mkdir -p images && chmod 755 images

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 644 /var/www/html/*.html /var/www/html/*.php \
    && chmod -R 644 /var/www/html/css/* /var/www/html/js/*

# Create .htaccess for better performance and security
RUN cat > .htaccess << 'EOF'
# Beehive Group - Apache Configuration

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
    ExpiresByType image/x-icon "access plus 1 year"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType application/x-shockwave-flash "access plus 1 month"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# Prevent access to sensitive files
<Files "*.md">
    Order allow,deny
    Deny from all
</Files>

<Files "Dockerfile">
    Order allow,deny
    Deny from all
</Files>

<Files ".env*">
    Order allow,deny
    Deny from all
</Files>

# Pretty URLs (if needed)
RewriteEngine On
RewriteBase /

# Redirect to HTTPS (uncomment in production)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove www (optional, uncomment if needed)
# RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
# RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# Custom error pages
ErrorDocument 404 /404.html
ErrorDocument 500 /500.html
EOF

# Create custom Apache configuration
RUN cat > /etc/apache2/sites-available/beehive.conf << 'EOF'
<VirtualHost *:80>
    ServerName beehivegroup.local
    DocumentRoot /var/www/html
    
    <Directory /var/www/html>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/beehive_error.log
    CustomLog ${APACHE_LOG_DIR}/beehive_access.log combined
    
    # Security
    ServerTokens Prod
    ServerSignature Off
</VirtualHost>
EOF

# Enable the site
RUN a2ensite beehive && a2dissite 000-default

# Configure PHP
RUN cat > /usr/local/etc/php/conf.d/beehive.ini << 'EOF'
; Beehive Group PHP Configuration

; Security
expose_php = Off
allow_url_fopen = Off
allow_url_include = Off

; Performance
memory_limit = 256M
max_execution_time = 30
max_input_time = 60
post_max_size = 8M
upload_max_filesize = 2M

; Error handling
display_errors = Off
log_errors = On
error_log = /var/log/php_errors.log

; Mail function
sendmail_path = "/usr/sbin/sendmail -t -i"

; Timezone
date.timezone = "Europe/Paris"
EOF

# Create sample images placeholder
RUN mkdir -p images && \
    echo "Place your images here:" > images/README.txt && \
    echo "- about-beehive.jpg (about section)" >> images/README.txt && \
    echo "- blog-1.jpg (blog post 1)" >> images/README.txt && \
    echo "- blog-2.jpg (blog post 2)" >> images/README.txt && \
    echo "- blog-3.jpg (blog post 3)" >> images/README.txt

# Create error pages
RUN cat > 404.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page non trouvée | Beehive Group</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container">
        <div class="row justify-content-center align-items-center min-vh-100">
            <div class="col-lg-6 text-center">
                <div class="error-content">
                    <h1 class="display-1 text-gold">404</h1>
                    <h2 class="mb-4">Page non trouvée</h2>
                    <p class="lead mb-4">Désolé, la page que vous recherchez n'existe pas.</p>
                    <a href="/" class="btn btn-gold">Retour à l'accueil</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
EOF

RUN cat > 500.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>500 - Erreur serveur | Beehive Group</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container">
        <div class="row justify-content-center align-items-center min-vh-100">
            <div class="col-lg-6 text-center">
                <div class="error-content">
                    <h1 class="display-1 text-gold">500</h1>
                    <h2 class="mb-4">Erreur serveur</h2>
                    <p class="lead mb-4">Une erreur technique est survenue. Nous travaillons à la résoudre.</p>
                    <a href="/" class="btn btn-gold">Retour à l'accueil</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
EOF

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Expose port 80
EXPOSE 80

# Start Apache in foreground
CMD ["apache2-foreground"]
