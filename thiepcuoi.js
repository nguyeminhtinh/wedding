// Navigation and scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navMenu?.classList.remove('active'));
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('animated');
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right').forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    } else {
        document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right').forEach(el => {
            el.classList.add('animated');
        });
    }
});

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
});

// Button event listeners
document.addEventListener('DOMContentLoaded', () => {
    const sendWishBtn = document.getElementById('sendWishBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    if (sendWishBtn) sendWishBtn.addEventListener('click', () => openModal('wishModal'));
    if (confirmBtn) confirmBtn.addEventListener('click', () => openModal('confirmModal'));
});

async function submitWish(source = 'form') {
    try {
        // Get elements based on source (form or modal)
        let wishText, wishName;
        
        if (source === 'modal') {
            // Get from modal
            wishText = document.getElementById('wishMessage');
            wishName = document.getElementById('wishName');
        } else {
            // Get from guestbook form
            wishText = document.getElementById('message');
            wishName = document.getElementById('name');
        }

        if (!wishText || !wishName) {
            alert('Không tìm thấy form!');
            return;
        }

        const text = wishText.value.trim();
        const name = wishName.value.trim();

        if (!text || !name) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbx6aMRy5xNvO0XRy5BV6QcNAzs5w53spnJld1-U7Fhuj-gQwkVR0Siw4QPlGVvoreLI/exec"; 

        await fetch(WEBAPP_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                name: name,
                message: text
            })
        });

        showNotification('🎉 Cảm ơn bạn đã gửi lời chúc!', 'success');
        
        // Clear form fields
        wishText.value = '';
        wishName.value = '';
        
        // Close modal if submitting from modal
        if (source === 'modal') {
            closeModal('wishModal');
        }
    } catch (error) {
        console.error('Error submitting wish:', error);
        alert("⚠ Không kết nối được server. Vui lòng thử lại.");
    }
}

function submitConfirm() {
    try {
        const confirmName = document.getElementById('confirmName');
        const confirmNumber = document.getElementById('confirmNumber');

        if (!confirmName || !confirmNumber) return;

        const name = confirmName.value.trim();
        const number = confirmNumber.value.trim();

        if (!name || !number) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const confirmation = {
            name: name,
            number: parseInt(number),
            date: new Date().toISOString()
        };

        let confirmations = JSON.parse(localStorage.getItem('confirmations')) || [];
        confirmations.push(confirmation);
        localStorage.setItem('confirmations', JSON.stringify(confirmations));

        confirmName.value = '';
        confirmNumber.value = '';

        closeModal('confirmModal');
        showNotification('Cảm ơn bạn đã xác nhận tham dự!', 'success');
    } catch (error) {
        console.error('Error submitting confirmation:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white; padding: 1rem 2rem; border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Calendar Functions
function addToCalendar(eventId) {
    const events = {
        event1: { name: 'LỄ VU QUY (Đám cưới Minh Tinh và Thị Lài)', description: 'Cảm ơn bạn đã dành thời gian tham dự đám cưới của chúng tôi!', startDate: '2025-12-21', startTime: '10:30', location: 'NHÀ SHVH THÔN VÂN TIÊN' },
        event2: { name: 'LỄ THÀNH HÔN (Đám cưới Minh Tình và Thị Lài)', description: 'Cảm ơn bạn đã dành thời gian tham dự đám cưới của chúng tôi!', startDate: '2025-12-25', startTime: '10:00', location: 'Khu Vui Chơi Trẻ Em Vinh Quang' }
    };
    const event = events[eventId];
    if (!event) return;
    const startDateTime = `${event.startDate}T${event.startTime}:00`.replace(/[-:]/g, '').slice(0, -2);
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startDateTime}/${startDateTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    window.open(googleUrl, '_blank');
    showNotification('Đã mở Google Calendar!', 'success');
}

function viewMap(eventId) {
    const locations = { event1: 'NHÀ SHVH THÔN VÂN TIÊN', event2: 'Khu Vui Chơi Trẻ Em Vinh Quang' };
    const location = locations[eventId];
    if (!location) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
}

// Gallery Lightbox Functionality
let galleryImages = [];
let currentImageIndex = 0;
let galleryInitialized = false;
let imageLoadObserver = null;

function initGalleryLightbox() {
    if (galleryInitialized) return;
    galleryInitialized = true;

    // Mark items with images
    document.querySelectorAll('.gallery-item').forEach(item => {
        if (item.querySelector('img')) item.classList.add('has-image');
    });

    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryImages = Array.from(galleryItems)
        .map(img => ({ src: img.src || img.getAttribute('src'), alt: img.alt || 'Gallery Image' }))
        .filter(img => img.src && img.src.trim() !== '');

    // Simple lazy loading
    if ('IntersectionObserver' in window) {
        const processed = new WeakSet();
        imageLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const img = entry.target;
                if (processed.has(img)) {
                    imageLoadObserver.unobserve(img);
                    return;
                }
                processed.add(img);
                const item = img.closest('.gallery-item');
                if (!item) {
                    imageLoadObserver.unobserve(img);
                    return;
                }
                const handleLoad = () => {
                    img.classList.add('loaded');
                    item.classList.add('image-loaded');
                };
                if (img.complete && img.naturalHeight !== 0) {
                    handleLoad();
                } else {
                    img.addEventListener('load', handleLoad, { once: true });
                    img.addEventListener('error', handleLoad, { once: true });
                }
                imageLoadObserver.unobserve(img);
            });
        }, { rootMargin: '20px', threshold: 0.01 });
        galleryItems.forEach(img => img.src && imageLoadObserver.observe(img));
    } else {
        galleryItems.forEach(img => {
            const item = img.closest('.gallery-item');
            if (item) {
                const handleLoad = () => {
                    img.classList.add('loaded');
                    item.classList.add('image-loaded');
                };
                if (img.complete && img.naturalHeight !== 0) handleLoad();
                else {
                    img.addEventListener('load', handleLoad, { once: true });
                    img.addEventListener('error', handleLoad, { once: true });
                }
            }
        });
    }

    // Add click event to gallery items (use event delegation for better performance)
    const galleryContainer = document.querySelector('.gallery-heart-container');
    if (galleryContainer) {
        galleryContainer.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (!galleryItem) return;
            const img = galleryItem.querySelector('img');
            if (img && img.src) {
                const imageIndex = galleryImages.findIndex(gImg => gImg.src === img.src);
                if (imageIndex !== -1) openLightbox(imageIndex);
            }
        });
    }

    // Lightbox controls
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox?.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft') navigateLightbox(-1);
            else if (e.key === 'ArrowRight') navigateLightbox(1);
        }
    });

    generateThumbnails();
}

function generateThumbnails() {
    try {
        const thumbnailsContainer = document.getElementById('lightboxThumbnails');
        if (!thumbnailsContainer || galleryImages.length === 0) return;

        // Clear existing thumbnails
        thumbnailsContainer.innerHTML = '';

        // Use event delegation for better performance
        thumbnailsContainer.addEventListener('click', (e) => {
            const thumbnail = e.target.closest('.lightbox-thumbnail');
            if (thumbnail) {
                const index = parseInt(thumbnail.dataset.index, 10);
                if (!isNaN(index) && index >= 0 && index < galleryImages.length) {
                    openLightbox(index);
                }
            }
        });

        // Create thumbnails with lazy loading
        galleryImages.forEach((img, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = img.src;
            thumbnail.alt = img.alt;
            thumbnail.className = 'lightbox-thumbnail';
            thumbnail.dataset.index = index;
            thumbnail.loading = 'lazy'; // Lazy load thumbnails
            if (index === 0) thumbnail.classList.add('active');

            // Handle thumbnail load errors
            thumbnail.addEventListener('error', () => {
                thumbnail.style.display = 'none';
            }, { once: true });

            thumbnailsContainer.appendChild(thumbnail);
        });
    } catch (error) {
        console.error('Error generating thumbnails:', error);
    }
}

function openLightbox(index) {
    try {
        const lightbox = document.getElementById('galleryLightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxCounter = document.getElementById('lightboxCounter');

        if (!lightbox || !lightboxImage || galleryImages.length === 0) return;

        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    } catch (error) {
        console.error('Error opening lightbox:', error);
    }
}

function closeLightbox() {
    try {
        const lightbox = document.getElementById('galleryLightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    } catch (error) {
        console.error('Error closing lightbox:', error);
    }
}

function navigateLightbox(direction) {
    try {
        if (galleryImages.length === 0) return;

        currentImageIndex += direction;

        if (currentImageIndex < 0) {
            currentImageIndex = galleryImages.length - 1;
        } else if (currentImageIndex >= galleryImages.length) {
            currentImageIndex = 0;
        }

        updateLightboxImage();
    } catch (error) {
        console.error('Error navigating lightbox:', error);
    }
}

function updateLightboxImage() {
    try {
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxCounter = document.getElementById('lightboxCounter');
        const thumbnails = document.querySelectorAll('.lightbox-thumbnail');

        if (!lightboxImage || !lightboxCounter || galleryImages.length === 0) return;

        const currentImage = galleryImages[currentImageIndex];
        if (!currentImage || !currentImage.src) return;

        // Show loading state
        lightboxImage.style.opacity = '0.5';
        
        // Handle image load
        const onImageLoad = () => {
            lightboxImage.style.opacity = '1';
            lightboxImage.removeEventListener('load', onImageLoad);
            lightboxImage.removeEventListener('error', onImageError);
        };
        
        const onImageError = () => {
            lightboxImage.style.opacity = '1';
            lightboxImage.alt = 'Image failed to load';
            lightboxImage.removeEventListener('load', onImageLoad);
            lightboxImage.removeEventListener('error', onImageError);
        };
        
        lightboxImage.addEventListener('load', onImageLoad, { once: true });
        lightboxImage.addEventListener('error', onImageError, { once: true });
        
        lightboxImage.src = currentImage.src;
        lightboxImage.alt = currentImage.alt;

        // Update counter
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;

        // Update active thumbnail
        thumbnails.forEach((thumb, index) => {
            if (index === currentImageIndex) {
                thumb.classList.add('active');
                // Scroll thumbnail into view (with fallback and error handling)
                try {
                    if (thumb.scrollIntoView) {
                        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                } catch (scrollError) {
                    // Fallback if scrollIntoView fails
                    thumb.scrollIntoView(false);
                }
            } else {
                thumb.classList.remove('active');
            }
        });
    } catch (error) {
        console.error('Error updating lightbox image:', error);
    }
}

// Countdown Timer
function updateCountdown() {
    try {
        // Set target date: 25 December 2025, 16:00
        const targetDate = new Date('2025-12-25T16:00:00').getTime();
        const now = new Date().getTime();
        const distance = targetDate - now;

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        if (distance < 0) {
            // If countdown is over
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update display with leading zeros
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    } catch (error) {
        console.error('Error updating countdown:', error);
    }
}

// Background Music Auto Play
function initBackgroundMusic() {
    try {
        const backgroundMusic = document.getElementById('backgroundMusic');
        if (!backgroundMusic) return;

        // Set volume
        backgroundMusic.volume = 0.5;

        // Try to play music automatically on page load
        // Most browsers require user interaction, so we'll try on first user interaction
        const playMusic = () => {
            if (backgroundMusic) {
                backgroundMusic.play().catch((error) => {
                    // Autoplay was prevented - this is expected in most browsers
                    console.log('Autoplay prevented, waiting for user interaction');
                });
            }
        };

        // Try to play immediately (may fail due to browser autoplay policy)
        playMusic();

        // Enable audio on any user interaction (required by most browsers)
        const enableAudio = () => {
            playMusic();
        };

        // Listen for first user interaction to enable audio
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('touchstart', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });
    } catch (error) {
        console.error('Error initializing background music:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize countdown timer
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
        
        // Clear interval if page unloads
        window.addEventListener('beforeunload', () => {
            clearInterval(countdownInterval);
        });

        // Initialize image slider
        initImageSlider();

        // Initialize gallery lightbox
        initGalleryLightbox();

        // Initialize background music (auto play)
        initBackgroundMusic();

        // Add parallax effect to hero section with throttling
        let lastScrollTime = 0;
        const scrollThrottle = 16; // ~60fps
        
        const handleParallax = () => {
            const now = Date.now();
            if (now - lastScrollTime < scrollThrottle) {
                return;
            }
            lastScrollTime = now;
            
            try {
                const scrolled = window.pageYOffset;
                const heroSection = document.querySelector('.hero-section');
                if (heroSection && scrolled < window.innerHeight) {
                    heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
                }
            } catch (error) {
                console.error('Parallax error:', error);
            }
        };
        
        window.addEventListener('scroll', handleParallax, { passive: true });
        
        // Cleanup Intersection Observer on page unload
        window.addEventListener('beforeunload', () => {
            try {
                if (imageLoadObserver) {
                    imageLoadObserver.disconnect();
                    imageLoadObserver = null;
                }
            } catch (e) {
                // Ignore cleanup errors
            }
        });
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Add CSS animations dynamically
try {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
} catch (error) {
    console.error('Error adding styles:', error);
}

// Falling Hearts Animation
let heartInterval;

function createFallingHeart() {
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (15 + Math.random() * 15) + 'px';
    const duration = 3 + Math.random() * 3;
    heart.style.animationDuration = duration + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), (duration + 2) * 1000);
}

function startFallingHearts() {
    heartInterval = setInterval(createFallingHeart, 300 + Math.random() * 500);
}

function stopFallingHearts() {
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(startFallingHearts, 1000);
});

document.addEventListener('visibilitychange', () => {
    document.hidden ? stopFallingHearts() : startFallingHearts();
});

// Image Slider Functionality
let currentSlide = 0;
let slideInterval;
const slideDuration = 5000; // 5 seconds

function initImageSlider() {
    try {
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const dotsContainer = document.getElementById('sliderDots');
        
        if (slides.length === 0 || !dotsContainer) return;
        
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'slider-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        // Previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                clearInterval(slideInterval);
                prevSlide();
                startAutoSlide();
            });
        }
        
        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                clearInterval(slideInterval);
                nextSlide();
                startAutoSlide();
            });
        }
        
        // Start auto slide
        startAutoSlide();
        
        // Pause on hover (only for desktop)
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                startAutoSlide();
            });
        }
    } catch (error) {
        console.error('Error initializing image slider:', error);
    }
}

function showSlide(index) {
    try {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slider-dot');
        
        if (slides.length === 0) return;
        
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    } catch (error) {
        console.error('Error showing slide:', error);
    }
}

function nextSlide() {
    try {
        const slides = document.querySelectorAll('.slide');
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    } catch (error) {
        console.error('Error going to next slide:', error);
    }
}

function prevSlide() {
    try {
        const slides = document.querySelectorAll('.slide');
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    } catch (error) {
        console.error('Error going to previous slide:', error);
    }
}

function goToSlide(index) {
    try {
        clearInterval(slideInterval);
        showSlide(index);
        startAutoSlide();
    } catch (error) {
        console.error('Error going to slide:', error);
    }
}

function startAutoSlide() {
    try {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            nextSlide();
        }, slideDuration);
    } catch (error) {
        console.error('Error starting auto slide:', error);
    }
}
