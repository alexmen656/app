// Mobile menu functionality
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenu.style.display === 'flex') {
        mobileMenu.style.display = 'none';
        menuBtn.classList.remove('active');
    } else {
        mobileMenu.style.display = 'flex';
        menuBtn.classList.add('active');
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    mobileMenu.style.display = 'none';
    menuBtn.classList.remove('active');
}

// Demo video functionality
function playDemo() {
    // For now, just scroll to features section
    // In a real implementation, you would open a modal with a demo video
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
    
    // You could also show a modal with embedded video:
    // showDemoModal();
}

function showDemoModal() {
    // Create modal overlay
    const modalHTML = `
        <div class="demo-modal-overlay" onclick="closeDemoModal()">
            <div class="demo-modal" onclick="event.stopPropagation()">
                <button class="demo-close" onclick="closeDemoModal()">×</button>
                <div class="demo-video">
                    <video controls autoplay muted>
                        <source src="demo-video.mp4" type="video/mp4">
                        Ihr Browser unterstützt das Video-Tag nicht.
                    </video>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

function closeDemoModal() {
    const modal = document.querySelector('.demo-modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll listener for navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .step, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Store button functionality
document.addEventListener('DOMContentLoaded', function() {
    const appStoreBtn = document.querySelector('.app-store');
    const googlePlayBtn = document.querySelector('.google-play');
    
    if (appStoreBtn) {
        appStoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Replace with actual App Store URL when available
            window.open('https://apps.apple.com/app/kaloriq', '_blank');
        });
    }
    
    if (googlePlayBtn) {
        googlePlayBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Replace with actual Google Play URL when available
            window.open('https://play.google.com/store/apps/details?id=com.kaloriq.app', '_blank');
        });
    }
});

// Device detection for appropriate store button
function detectDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        // Hide Google Play button on iOS
        const googlePlayBtn = document.querySelector('.google-play');
        if (googlePlayBtn) {
            googlePlayBtn.style.display = 'none';
        }
    }
    
    // Android detection
    if (/android/i.test(userAgent)) {
        // Hide App Store button on Android
        const appStoreBtn = document.querySelector('.app-store');
        if (appStoreBtn) {
            appStoreBtn.style.display = 'none';
        }
    }
}

// Call device detection when page loads
document.addEventListener('DOMContentLoaded', detectDevice);

// Add CSS for demo modal
const demoModalCSS = `
.demo-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
}

.demo-modal {
    background: white;
    border-radius: 20px;
    padding: 0;
    max-width: 800px;
    width: 100%;
    position: relative;
    overflow: hidden;
}

.demo-close {
    position: absolute;
    top: 15px;
    right: 20px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 24px;
    cursor: pointer;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.demo-video {
    width: 100%;
}

.demo-video video {
    width: 100%;
    height: auto;
    display: block;
}

@media (max-width: 768px) {
    .demo-modal {
        margin: 20px;
        max-width: calc(100vw - 40px);
    }
}
`;

// Inject demo modal CSS
const style = document.createElement('style');
style.textContent = demoModalCSS;
document.head.appendChild(style);

// Analytics tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    // Here you would integrate with your analytics service
    // For example: Google Analytics, Mixpanel, etc.
    console.log('Event tracked:', eventName, properties);
    
    // Example Google Analytics implementation:
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, properties);
    // }
}

// Track button clicks
document.addEventListener('DOMContentLoaded', function() {
    // Track download button clicks
    document.querySelectorAll('.store-button').forEach(btn => {
        btn.addEventListener('click', function() {
            const store = this.classList.contains('app-store') ? 'App Store' : 'Google Play';
            trackEvent('download_click', { store: store });
        });
    });
    
    // Track demo button clicks
    document.querySelectorAll('[onclick="playDemo()"]').forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('demo_click');
        });
    });
    
    // Track navigation clicks
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('navigation_click', { section: this.getAttribute('href') });
        });
    });
});

// Performance optimization: Lazy load images
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Add error handling for store buttons
function handleStoreError(store) {
    const message = `Die ${store} App ist noch nicht verfügbar. Wir benachrichtigen Sie, sobald sie released wird!`;
    
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #007052;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 300px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add slide-in animation
    const slideInCSS = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    
    if (!document.querySelector('#slide-in-styles')) {
        const style = document.createElement('style');
        style.id = 'slide-in-styles';
        style.textContent = slideInCSS;
        document.head.appendChild(style);
    }
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
