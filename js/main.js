// ===== Beehive Group - Interactive JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Navbar scroll effect
    const navbar = document.getElementById('mainNavbar');
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('show');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('show');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });

    // Back to top button
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hero carousel enhancements (defensive to avoid crashes)
    function initHeroCarousel() {
        try {
            const heroCarousel = document.getElementById('heroCarousel');
            if (!heroCarousel || !window.bootstrap || !window.bootstrap.Carousel) return;

            // Avoid double init by using getOrCreateInstance when available
            const carouselInstance = (window.bootstrap.Carousel.getOrCreateInstance)
                ? window.bootstrap.Carousel.getOrCreateInstance(heroCarousel, { interval: 7000, ride: 'carousel', pause: false })
                : new window.bootstrap.Carousel(heroCarousel, { interval: 7000, ride: 'carousel', pause: false });

            // Auto-pause on hover
            heroCarousel.addEventListener('mouseenter', function() {
                try { carouselInstance.pause(); } catch (e) {}
            }, { passive: true });
            heroCarousel.addEventListener('mouseleave', function() {
                try { carouselInstance.cycle(); } catch (e) {}
            }, { passive: true });

            const indicators = document.querySelectorAll('.modern-indicator');
            const updateIndicators = (activeIndex) => {
                if (!indicators || indicators.length === 0) return;
                indicators.forEach((btn, idx) => {
                    try {
                        btn.classList.toggle('active', idx === activeIndex);
                        const progress = btn.querySelector('.indicator-progress');
                        if (progress) progress.style.width = idx === activeIndex ? '100%' : '0%';
                    } catch (e) {}
                });
            };

            heroCarousel.addEventListener('slide.bs.carousel', function (e) {
                if (typeof e.to === 'number') updateIndicators(e.to);
            });

            // Let Bootstrap handle indicator clicks via data attributes only
            // We do not bind custom click handlers to avoid double navigation

            // Pause when tab hidden, resume when visible
            document.addEventListener('visibilitychange', () => {
                try {
                    if (document.hidden) carouselInstance.pause();
                    else carouselInstance.cycle();
                } catch (e) {}
            });

            // Initialize first indicator
            updateIndicators(0);
        } catch (err) {
            console.error('Hero carousel init error:', err);
        }
    }

    // Initialize after page fully loaded to avoid race with CDN scripts
    if (document.readyState === 'complete') initHeroCarousel();
    else window.addEventListener('load', initHeroCarousel, { once: true });

    // Service cards hover animations
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('glow-animation');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('glow-animation');
        });
    });

    // Feature cards interactive effects
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add golden glow effect
            this.style.boxShadow = '0 15px 35px rgba(212, 160, 23, 0.4)';
            
            // Animate icon rotation
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(10deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });

    // Blog cards hover effects
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const image = this.querySelector('.blog-image img');
            if (image) {
                image.style.transform = 'scale(1.1) rotate(2deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const image = this.querySelector('.blog-image img');
            if (image) {
                image.style.transform = '';
            }
        });
    });

    // Timeline animation on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add staggered animation delay
                const delay = Array.from(timelineItems).indexOf(entry.target) * 200;
                setTimeout(() => {
                    entry.target.classList.add('loading');
                }, delay);
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease-out';
        timelineObserver.observe(item);
    });

    // Form validations and submissions
    const contactForm = document.getElementById('contactForm');
    const demoForm = document.getElementById('demoForm');
    
    // Contact form handler
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            if (!data.name || !data.email || !data.message) {
                showNotification('Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }
            
            // Animate submit button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi en cours...';
            submitBtn.disabled = true;
            
            // Send to PHP backend
            fetch('contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    showNotification(result.message, 'success');
                    this.reset();
                } else {
                    showNotification(result.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Erreur lors de l\'envoi du message. Veuillez réessayer.', 'error');
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // Demo form handler
    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            const requiredFields = ['name', 'company', 'email', 'phone', 'service'];
            const missingFields = requiredFields.filter(field => !data[field]);
            
            if (missingFields.length > 0) {
                showNotification('Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Programmation...';
            submitBtn.disabled = true;
            
            // Send to PHP backend
            fetch('demo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    showNotification(result.message, 'success');
                    this.reset();
                    
                    // Show additional info if available
                    if (result.data && result.data.contact_time) {
                        setTimeout(() => {
                            showNotification(`Service sélectionné: ${result.data.service}`, 'info');
                        }, 2000);
                    }
                } else {
                    showNotification(result.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Erreur lors de la programmation. Veuillez réessayer ou nous contacter directement.', 'error');
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                showNotification('Inscription réussie! Merci de votre intérêt.', 'success');
                this.reset();
            }
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        let alertClass = 'alert-info';
        let icon = 'info-circle';
        
        switch(type) {
            case 'success':
                alertClass = 'alert-success';
                icon = 'check-circle';
                break;
            case 'error':
                alertClass = 'alert-danger';
                icon = 'exclamation-circle';
                break;
            case 'warning':
                alertClass = 'alert-warning';
                icon = 'exclamation-triangle';
                break;
            default:
                alertClass = 'alert-info';
                icon = 'info-circle';
        }
        
        notification.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 100px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            border-radius: 10px;
            border: none;
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${icon} me-2"></i>
                <span>${message}</span>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Parallax effect for hero section (apply to background only to avoid interfering with Carousel)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.slide-background, .bg-gradient');
        
        parallaxElements.forEach(element => {
            const speed = 0.3;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, { passive: true });

    // Animated counters (if you add stats section later)
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current).toLocaleString();
            }, 16);
        });
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Feature tabs enhancement
    const featureTabs = document.querySelectorAll('#featureTabs button');
    featureTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Add slide animation to tab content
            const targetId = this.getAttribute('data-bs-target');
            const targetContent = document.querySelector(targetId);
            
            if (targetContent) {
                // Reset and animate the features
                const featureCards = targetContent.querySelectorAll('.feature-card');
                featureCards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'all 0.6s ease-out';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    });

    // Add golden particles effect (optional enhancement)
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #D4A017;
                border-radius: 50%;
                opacity: 0.3;
                animation: float ${Math.random() * 6 + 4}s linear infinite;
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 6}s;
            `;
            particlesContainer.appendChild(particle);
        }
        
        // Add particle animation keyframes
        if (!document.querySelector('#particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes float {
                    0% {
                        transform: translateY(100vh) rotate(0deg);
                        opacity: 0.3;
                    }
                    10% {
                        opacity: 0.6;
                    }
                    90% {
                        opacity: 0.6;
                    }
                    100% {
                        transform: translateY(-100px) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(particlesContainer);
    }

    // Initialize particles on hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        createParticles();
    }

    // Page loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animate elements on page load
        const elementsToAnimate = document.querySelectorAll('.service-card, .feature-card, .blog-card');
        elementsToAnimate.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('loading');
            }, index * 100);
        });
    });

    // Mobile menu enhancement
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            // Add custom animation class
            navbarCollapse.classList.toggle('mobile-menu-active');
        });
    }

    // WhatsApp float button enhancement
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        whatsappFloat.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }

    // Form field animations
    const floatingInputs = document.querySelectorAll('.form-floating input, .form-floating textarea, .form-floating select');
    floatingInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
    });

    // Reveal animations for sections
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                
                // Trigger specific animations based on section
                const sectionId = entry.target.id;
                switch(sectionId) {
                    case 'features':
                        animateFeatureCards();
                        break;
                    case 'about':
                        animateTimeline();
                        break;
                    case 'blog':
                        animateBlogCards();
                        break;
                }
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => sectionObserver.observe(section));

    function animateFeatureCards() {
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.opacity = '1';
            }, index * 100);
        });
    }

    function animateTimeline() {
        const items = document.querySelectorAll('.timeline-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }

    function animateBlogCards() {
        const cards = document.querySelectorAll('.blog-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(0) rotate(0deg)';
                card.style.opacity = '1';
            }, index * 150);
        });
    }

    // Add CSS for enhanced animations
    const enhancedStyles = document.createElement('style');
    enhancedStyles.textContent = `
        .mobile-menu-active {
            animation: slideDown 0.3s ease-out;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        .section-visible {
            animation: fadeInSection 0.8s ease-out;
        }
        
        @keyframes fadeInSection {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .form-floating.focused label {
            color: var(--gold-primary) !important;
        }
        
        .loaded .hero-title {
            animation: heroTitleReveal 1s ease-out;
        }
        
        .loaded .hero-subtitle {
            animation: heroSubtitleReveal 1s ease-out 0.3s both;
        }
        
        @keyframes heroTitleReveal {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes heroSubtitleReveal {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(enhancedStyles);

    console.log('🐝 Beehive Group website loaded successfully!');
});

// Utility function for smooth animations
function animateElement(element, animation, duration = 600) {
    return new Promise(resolve => {
        element.style.animation = `${animation} ${duration}ms ease-out`;
        element.addEventListener('animationend', resolve, { once: true });
    });
}

// Custom cursor effect (optional)
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(212, 160, 23, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: multiply;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });
}

// Initialize custom cursor for desktop only
if (window.innerWidth > 768) {
    initCustomCursor();
}
