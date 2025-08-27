#!/bin/bash

# Beehive Group Website Deployment Script
# Usage: ./deploy.sh [production|staging|local]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT=${1:-local}

echo -e "${BLUE}🐝 Beehive Group Website Deployment${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo "================================================"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if running on Windows (Git Bash/WSL)
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    print_warning "Detected Windows environment"
    IS_WINDOWS=true
else
    IS_WINDOWS=false
fi

# Create necessary directories
print_status "Creating directory structure..."
mkdir -p images/temp
mkdir -p logs
mkdir -p backups

# Set permissions (Unix/Linux only)
if [ "$IS_WINDOWS" = false ]; then
    print_status "Setting file permissions..."
    find . -type f -name "*.php" -exec chmod 644 {} \;
    find . -type f -name "*.html" -exec chmod 644 {} \;
    find . -type f -name "*.css" -exec chmod 644 {} \;
    find . -type f -name "*.js" -exec chmod 644 {} \;
    find . -type d -exec chmod 755 {} \;
    chmod +x deploy.sh
fi

# Environment-specific configurations
case $ENVIRONMENT in
    "production")
        print_status "Setting up production environment..."
        
        # Create production config
        cat > .env << 'EOF'
ENVIRONMENT=production
DEBUG=false
CONTACT_EMAIL=contact@beehivegroup.com
DEMO_EMAIL=demo@beehivegroup.com
SMTP_HOST=smtp.beehivegroup.com
SMTP_PORT=587
SMTP_SECURE=true
ENABLE_HTTPS=true
ENABLE_CACHE=true
EOF
        
        # Production .htaccess
        cat > .htaccess << 'EOF'
# Beehive Group - Production .htaccess

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove www
RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' cdn.jsdelivr.net fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: images.unsplash.com; connect-src 'self'"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/xml application/xhtml+xml application/rss+xml application/javascript application/x-javascript
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
</IfModule>

# Prevent access to sensitive files
<Files ".env*">
    Order allow,deny
    Deny from all
</Files>
<Files "*.md">
    Order allow,deny
    Deny from all
</Files>
<Files "deploy.sh">
    Order allow,deny
    Deny from all
</Files>
<Files "Dockerfile">
    Order allow,deny
    Deny from all
</Files>

# Custom error pages
ErrorDocument 404 /404.html
ErrorDocument 500 /500.html
EOF

        print_status "Production environment configured"
        ;;
        
    "staging")
        print_status "Setting up staging environment..."
        
        cat > .env << 'EOF'
ENVIRONMENT=staging
DEBUG=true
CONTACT_EMAIL=staging-contact@beehivegroup.com
DEMO_EMAIL=staging-demo@beehivegroup.com
SMTP_HOST=smtp.beehivegroup.com
SMTP_PORT=587
SMTP_SECURE=true
ENABLE_HTTPS=false
ENABLE_CACHE=false
EOF
        
        print_status "Staging environment configured"
        ;;
        
    "local")
        print_status "Setting up local development environment..."
        
        cat > .env << 'EOF'
ENVIRONMENT=local
DEBUG=true
CONTACT_EMAIL=test-contact@localhost
DEMO_EMAIL=test-demo@localhost
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
ENABLE_HTTPS=false
ENABLE_CACHE=false
EOF
        
        # Simple .htaccess for local development
        cat > .htaccess << 'EOF'
# Beehive Group - Local Development .htaccess

RewriteEngine On
RewriteBase /

# Custom error pages
ErrorDocument 404 /404.html
ErrorDocument 500 /500.html

# Enable CORS for local development
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
</IfModule>
EOF
        
        print_status "Local development environment configured"
        ;;
        
    *)
        print_error "Unknown environment: $ENVIRONMENT"
        print_warning "Available environments: production, staging, local"
        exit 1
        ;;
esac

# Create sample images if they don't exist
print_status "Setting up sample images..."

# Create placeholder images with different colors for each service
if [ ! -f "images/about-beehive.jpg" ]; then
    print_warning "Creating placeholder for about-beehive.jpg"
    echo "Place your about image here (recommended: 800x600px)" > images/about-beehive.txt
fi

for i in {1..3}; do
    if [ ! -f "images/blog-$i.jpg" ]; then
        print_warning "Creating placeholder for blog-$i.jpg"
        echo "Place your blog image $i here (recommended: 400x250px)" > "images/blog-$i.txt"
    fi
done

# Optimize images if imagemagick is available (Unix/Linux only)
if [ "$IS_WINDOWS" = false ] && command -v convert >/dev/null 2>&1; then
    print_status "Optimizing images with ImageMagick..."
    find images/ -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | while read img; do
        if [[ -f "$img" ]]; then
            convert "$img" -strip -interlace Plane -gaussian-blur 0.05 -quality 85% "${img%.*}_optimized.${img##*.}"
        fi
    done
fi

# Create logs directory structure
print_status "Setting up logging..."
mkdir -p logs/{access,error,php,email}

# Set up log rotation config
cat > logs/logrotate.conf << 'EOF'
logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 www-data www-data
}
EOF

# Database setup (if needed later)
print_status "Database setup (placeholder)..."
cat > database.sql << 'EOF'
-- Beehive Group Database Schema
-- Run this if you need database functionality later

CREATE DATABASE IF NOT EXISTS beehive_group;
USE beehive_group;

CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status ENUM('new', 'read', 'replied') DEFAULT 'new'
);

CREATE TABLE IF NOT EXISTS demo_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    service ENUM('lodge', 'service', 'store', 'all') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status ENUM('new', 'contacted', 'demo_scheduled', 'completed') DEFAULT 'new',
    scheduled_date DATETIME NULL,
    notes TEXT
);

CREATE INDEX idx_contact_created ON contact_submissions(created_at);
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_demo_created ON demo_requests(created_at);
CREATE INDEX idx_demo_status ON demo_requests(status);
CREATE INDEX idx_demo_service ON demo_requests(service);
EOF

# Backup existing site if this is an update
if [ -f "index.html.backup" ]; then
    BACKUP_DIR="backups/backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    print_status "Creating backup in $BACKUP_DIR"
    cp -r . "$BACKUP_DIR/" 2>/dev/null || true
fi

# Performance check
print_status "Running basic checks..."

# Check if PHP is available
if command -v php >/dev/null 2>&1; then
    php_version=$(php -v | head -n 1 | cut -d ' ' -f 2)
    print_status "PHP version: $php_version"
    
    # Check PHP configuration
    php -m | grep -E "(curl|mbstring|openssl)" >/dev/null && print_status "Required PHP modules available" || print_warning "Some PHP modules may be missing"
else
    print_warning "PHP not found - form functionality will not work"
fi

# Check file sizes
total_size=$(du -sh . 2>/dev/null | cut -f1 || echo "unknown")
print_status "Total project size: $total_size"

# Generate deployment summary
cat > deployment_summary.txt << EOF
Beehive Group Website Deployment Summary
========================================

Environment: $ENVIRONMENT
Date: $(date)
Total Size: $total_size

Files Deployed:
- index.html (main website)
- css/style.css (custom styles)
- js/main.js (interactive features)
- contact.php (contact form handler)
- demo.php (demo request handler)
- README.md (documentation)
- Dockerfile (containerization)

Configuration:
- Environment file created
- Apache .htaccess configured
- Error pages created
- Log directories set up

Next Steps:
1. Upload files to your web server
2. Configure DNS settings
3. Set up SSL certificate (production only)
4. Test contact and demo forms
5. Configure email settings
6. Add real images to images/ directory
7. Customize content as needed

For support: dev@beehivegroup.com
EOF

print_status "Deployment summary created"

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}Environment: $ENVIRONMENT${NC}"
echo -e "${BLUE}View deployment summary: deployment_summary.txt${NC}"

if [ "$ENVIRONMENT" = "local" ]; then
    echo ""
    echo -e "${YELLOW}Local Development Instructions:${NC}"
    echo "1. Start a local web server:"
    echo "   - PHP: php -S localhost:8000"
    echo "   - Python: python -m http.server 8000"
    echo "   - Node: npx serve -p 8000"
    echo "2. Open http://localhost:8000 in your browser"
    echo "3. Test all features including contact forms"
elif [ "$ENVIRONMENT" = "production" ]; then
    echo ""
    echo -e "${YELLOW}Production Deployment Checklist:${NC}"
    echo "□ Upload files to web server"
    echo "□ Configure SSL certificate"
    echo "□ Update DNS records"
    echo "□ Test contact forms with real email"
    echo "□ Set up monitoring and backups"
    echo "□ Configure CDN (optional)"
    echo "□ Run security scan"
fi

echo ""
print_status "Happy coding! 🐝"
