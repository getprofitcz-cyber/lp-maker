/**
 * GETPROFIT Main JavaScript
 * Modern vanilla JS with ES6+ features
 */

// ===================================
// Utility Functions
// ===================================

/**
 * Debounce function to limit event handler calls
 */
const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function for scroll events
 */
const throttle = (func, limit = 100) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ===================================
// Mobile Menu Toggle
// ===================================

const initMobileMenu = () => {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = menuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.focus();
        }
    });
};

// ===================================
// Smooth Scroll for Anchor Links
// ===================================

const initSmoothScroll = () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip empty anchors
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Get header height for offset
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
                
                // Focus target for accessibility
                target.focus({ preventScroll: true });
            }
        });
    });
};

// ===================================
// Lazy Loading Images
// ===================================

const initLazyLoading = () => {
    // For images with data-src, use IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window && lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add fade-in animation
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease-in';
                    
                    // Load image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });
                    
                    observer.unobserve(img);
                }
            });
        }, {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // For images with loading="lazy", browser handles it natively
    // Just add fade-in effect when they load
    const nativeLazyImages = document.querySelectorAll('img[loading="lazy"]:not([data-src])');
    nativeLazyImages.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease-in';
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            }, { once: true });
        }
    });
};

// ===================================
// Scroll Reveal Animations
// ===================================

const initScrollAnimations = () => {
    // Select all sections and cards for scroll reveal
    const revealElements = document.querySelectorAll(`
        .hero,
        .clients,
        .problems,
        .statistics,
        .features,
        .quick-start,
        .partners,
        .client-item,
        .problem-item,
        .stat-item,
        .feature-item,
        .quick-start-item
    `);
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for items in grid
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 50);
                    
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '-50px',
            threshold: 0.1
        });
        
        revealElements.forEach((el, index) => {
            // Add initial hidden state
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            
            revealObserver.observe(el);
        });
        
        // When element is revealed
        document.addEventListener('DOMContentLoaded', () => {
            const style = document.createElement('style');
            style.textContent = `
                .revealed {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            `;
            document.head.appendChild(style);
        });
    }
    
    // Activate stat-item progress bars when in view
    const statItems = document.querySelectorAll('.stat-item');
    if ('IntersectionObserver' in window && statItems.length > 0) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    statObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        statItems.forEach(item => statObserver.observe(item));
    }
};

// ===================================
// Video Player Controls
// ===================================

const initVideoControls = () => {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Ensure autoplay works on mobile
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay was prevented, try playing on user interaction
                document.addEventListener('click', () => {
                    video.play();
                }, { once: true });
            });
        }
        
        // Pause video when out of viewport
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play();
                    } else {
                        video.pause();
                    }
                });
            }, {
                threshold: 0.5
            });
            
            videoObserver.observe(video);
        }
    });
};

// ===================================
// Header Scroll Effect
// ===================================

const initHeaderScroll = () => {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    
    const handleScroll = throttle(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header on scroll down, show on scroll up
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
};

// ===================================
// Form Handling (for future forms)
// ===================================

const initFormHandling = () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitButton = form.querySelector('[type="submit"]');
            
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Надсилання...';
            }
            
            try {
                // Here you would send data to your backend
                // For now, just log it
                console.log('Form data:', Object.fromEntries(formData));
                
                // Show success message
                alert('Дякуємо! Ми зв\'яжемося з вами найближчим часом.');
                form.reset();
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Виникла помилка. Будь ласка, спробуйте ще раз.');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Надіслати';
                }
            }
        });
    });
};

// ===================================
// Stats Counter Animation
// ===================================

const initStatsCounter = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateValue = (element, start, end, duration) => {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                element.textContent = element.dataset.originalText;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + ' %';
            }
        }, 16);
    };
    
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    const element = entry.target;
                    const text = element.textContent.trim();
                    const match = text.match(/(\d+)/);
                    
                    if (match) {
                        const targetNumber = parseInt(match[1]);
                        element.dataset.originalText = text;
                        element.dataset.animated = 'true';
                        animateValue(element, 0, targetNumber, 2000);
                    }
                    
                    counterObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.5
        });
        
        statNumbers.forEach(stat => counterObserver.observe(stat));
    }
};

// ===================================
// Parallax Effect for Hero
// ===================================

const initParallax = () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const handleParallax = throttle(() => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            const parallaxSpeed = 0.5;
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            hero.style.opacity = 1 - (scrolled / heroHeight) * 0.5;
        }
    }, 16);
    
    window.addEventListener('scroll', handleParallax, { passive: true });
};

// ===================================
// Back to Top Button
// ===================================

const initBackToTop = () => {
    // Create button if it doesn't exist
    let backToTopButton = document.querySelector('.back-to-top');
    
    if (!backToTopButton) {
        backToTopButton = document.createElement('button');
        backToTopButton.className = 'back-to-top';
        backToTopButton.innerHTML = '↑';
        backToTopButton.setAttribute('aria-label', 'Повернутися на початок сторінки');
        document.body.appendChild(backToTopButton);
        
        // Add styles with gradient
        const style = document.createElement('style');
        style.textContent = `
            .back-to-top {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #1912CB 0%, #6B46FF 100%);
                color: white;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 999;
                box-shadow: 0 8px 16px rgba(25, 18, 203, 0.3);
            }
            .back-to-top.visible {
                opacity: 1;
                visibility: visible;
            }
            .back-to-top:hover {
                transform: translateY(-6px) scale(1.05);
                box-shadow: 0 12px 24px rgba(107, 70, 255, 0.4);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Show/hide button based on scroll position
    const toggleButton = throttle(() => {
        if (window.pageYOffset > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }, 100);
    
    window.addEventListener('scroll', toggleButton, { passive: true });
    
    // Scroll to top on click
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// ===================================
// Initialize All Features
// ===================================

const init = () => {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }
    
    console.log('🚀 GETPROFIT initialized');
    
    // Initialize all features
    initMobileMenu();
    initSmoothScroll();
    initLazyLoading();
    initScrollAnimations();
    initVideoControls();
    initHeaderScroll();
    initFormHandling();
    initStatsCounter();
    initParallax();
    initBackToTop();
    
    // Log GTM dataLayer for debugging (only in development)
    if (window.dataLayer && window.location.hostname === 'localhost') {
        console.log('GTM dataLayer:', window.dataLayer);
    }
};

// Start initialization
init();

// Export functions for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        initMobileMenu,
        initSmoothScroll,
        initLazyLoading
    };
}
