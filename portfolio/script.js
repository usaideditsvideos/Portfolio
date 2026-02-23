/* ========================================
   USAID SHAIKH - PORTFOLIO SCRIPTS
   Smooth Scroll, Animations & Interactivity
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initSmoothScroll();
    initScrollReveal();
    initMobileMenu();
    initVideoPlayers();
    initParallaxEffects();
    initParallaxVideoSection(); // New parallax video zoom effect
});

/* ========================================
   PARALLAX VIDEO ZOOM SECTION
   ======================================== */

function initParallaxVideoSection() {
    const parallaxSection = document.querySelector('.parallax-section');
    const mainVideoContainer = document.querySelector('.main-video-container');
    const editorBackground = document.querySelector('.editor-background');
    const parallaxHeader = document.querySelector('.parallax-header');
    const mainVideo = document.querySelector('.main-video');
    const playOverlay = document.getElementById('videoPlayOverlay');

    if (!parallaxSection || !mainVideoContainer) return;

    // Handle video play/pause
    if (mainVideo && playOverlay) {
        // Check if video can autoplay
        const playPromise = mainVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay was prevented, show play overlay
                playOverlay.classList.add('visible');
            });
        }

        // Click to play/pause
        playOverlay.addEventListener('click', () => {
            mainVideo.play();
            playOverlay.classList.remove('visible');
        });

        mainVideoContainer.addEventListener('click', () => {
            if (mainVideo.paused) {
                mainVideo.play();
                playOverlay.classList.remove('visible');
            }
        });
    }

    // Scroll-driven animation
    const mainVideoWrapper = document.querySelector('.main-video-wrapper');

    function updateParallax() {
        const rect = parallaxSection.getBoundingClientRect();
        const sectionHeight = parallaxSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        // Calculate scroll progress (0 = start, 1 = end)
        const scrolled = -rect.top;
        const scrollRange = sectionHeight - viewportHeight;
        const progress = Math.max(0, Math.min(1, scrolled / scrollRange));

        // Target position: where the preview panel is in the editor background
        // Adjust these values to match your exact editor layout
        const targetTop = 11;      // % from top
        const targetLeft = 16.97;     // % from left
        const targetWidth = 55.3;    // % of viewport width

        // Phase 1 (0-0.3): Video plays fullscreen
        // Phase 2 (0.3-0.7): Video zooms out to preview panel
        // Phase 3 (0.7-1): Settled on preview panel

        if (progress < 0.3) {
            // Fullscreen video - reset all positioning
            mainVideoContainer.style.position = 'relative';
            mainVideoContainer.style.width = '100%';
            mainVideoContainer.style.height = '100%';
            mainVideoContainer.style.top = '0';
            mainVideoContainer.style.left = '0';
            mainVideoContainer.style.borderRadius = '0';
            mainVideoContainer.style.aspectRatio = '';

            if (mainVideoWrapper) {
                mainVideoWrapper.style.alignItems = 'center';
                mainVideoWrapper.style.justifyContent = 'center';
            }

            if (editorBackground) editorBackground.classList.remove('visible');
            if (parallaxHeader) parallaxHeader.classList.remove('visible');
        } else if (progress < 0.7) {
            // Transitioning to preview panel position
            const t = (progress - 0.3) / 0.4; // 0 to 1 within this phase

            // Smoothly interpolate width from 100% to target
            const currentWidth = 100 - (t * (100 - targetWidth));
            const currentRadius = t * 2;

            mainVideoContainer.style.position = 'absolute';
            mainVideoContainer.style.width = `${currentWidth}%`;
            mainVideoContainer.style.height = 'auto';
            mainVideoContainer.style.aspectRatio = '16 / 9';
            mainVideoContainer.style.borderRadius = `${currentRadius}px`;

            // Smoothly move to target position
            mainVideoContainer.style.top = `${t * targetTop}%`;
            mainVideoContainer.style.left = `${t * targetLeft}%`;

            // Fade in editor background
            if (editorBackground) {
                editorBackground.style.opacity = t;
                editorBackground.classList.toggle('visible', t > 0.2);
            }

            // Header appears at end of transition
            if (parallaxHeader) {
                parallaxHeader.classList.toggle('visible', t > 0.8);
            }
        } else {
            // Fully positioned on preview panel
            mainVideoContainer.style.position = 'absolute';
            mainVideoContainer.style.width = `${targetWidth}%`;
            mainVideoContainer.style.height = 'auto';
            mainVideoContainer.style.aspectRatio = '16 / 9';
            mainVideoContainer.style.top = `${targetTop}%`;
            mainVideoContainer.style.left = `${targetLeft}%`;
            mainVideoContainer.style.borderRadius = '2px';

            if (editorBackground) editorBackground.classList.add('visible');
            if (parallaxHeader) parallaxHeader.classList.add('visible');
        }
    }

    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
    updateParallax();
}

/* ========================================
   NAVBAR SCROLL EFFECT
   ======================================== */

function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when scrolling down
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ========================================
   SMOOTH SCROLLING
   ======================================== */

function initSmoothScroll() {
    // Handle all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const navToggle = document.getElementById('navToggle');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                }

                // Smooth scroll to target
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   SCROLL REVEAL ANIMATIONS
   ======================================== */

function initScrollReveal() {
    // Add reveal class to elements
    const revealElements = document.querySelectorAll(
        '.section-header, .project-card, .tool-card, .contact-link, .cta-card, .featured-video'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Add stagger effect to grid items
    addStaggerEffect('.projects-grid .project-card');
    addStaggerEffect('.tools-grid .tool-card');
}

function addStaggerEffect(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
    });
}

/* ========================================
   MOBILE MENU
   ======================================== */

function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

/* ========================================
   VIDEO PLAYER INTERACTIONS
   ======================================== */

function initVideoPlayers() {
    // Play button hover effects
    const playButtons = document.querySelectorAll('.play-button, .play-btn');

    playButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.1)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });

        // Click handler - can be extended for video modal
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Video player clicked - ready for video integration');

            // Add pulse animation
            btn.style.animation = 'none';
            btn.offsetHeight; // Trigger reflow
            btn.style.animation = 'pulse 0.3s ease-out';
        });
    });
}

/* ========================================
   PARALLAX & MOUSE EFFECTS
   ======================================== */

function initParallaxEffects() {
    const floatingElements = document.querySelectorAll('.float-element');
    const heroVisual = document.querySelector('.hero-visual');

    if (heroVisual && floatingElements.length > 0) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            floatingElements.forEach((el, index) => {
                const speed = (index + 1) * 15;
                const x = mouseX * speed;
                const y = mouseY * speed;

                el.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // Background glow parallax
    const glows = document.querySelectorAll('.bg-glow');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        glows.forEach((glow, index) => {
            const speed = (index + 1) * 0.1;
            glow.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

/* ========================================
   TYPING EFFECT (Optional Enhancement)
   ======================================== */

function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

/* ========================================
   CURSOR TRAIL EFFECT (Premium Effect)
   ======================================== */

function initCursorTrail() {
    const trail = [];
    const trailLength = 20;

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: ${12 - i * 0.5}px;
            height: ${12 - i * 0.5}px;
            background: linear-gradient(135deg, #00d4ff, #3d6cb9);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - i * 0.05};
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease-out;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }

    let mouseX = 0, mouseY = 0;
    let trailPositions = [];

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        trailPositions.unshift({ x: mouseX, y: mouseY });

        if (trailPositions.length > trailLength) {
            trailPositions.pop();
        }

        trail.forEach((dot, index) => {
            if (trailPositions[index]) {
                dot.style.left = trailPositions[index].x + 'px';
                dot.style.top = trailPositions[index].y + 'px';
            }
        });

        requestAnimationFrame(animateTrail);
    }

    animateTrail();
}

/* ========================================
   ACTIVE NAVIGATION HIGHLIGHT
   ======================================== */

function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize active navigation
initActiveNavigation();

/* ========================================
   COUNTER ANIMATION (For Stats if needed)
   ======================================== */

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }

    updateCounter();
}

/* ========================================
   PRELOADER (Optional)
   ======================================== */

function hidePreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
}

// Call when page is fully loaded
window.addEventListener('load', hidePreloader);

/* ========================================
   VIDEO GALLERY OVERLAY
   ======================================== */

function initVideoGallery() {
    const modal = document.getElementById('videoOverlayModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalSource = document.getElementById('modalVideoSource');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const modalCategory = document.getElementById('modalCategory');
    const modalCounter = document.getElementById('modalCounter');
    const modalBackdrop = modal ? modal.querySelector('.modal-backdrop') : null;

    if (!modal || !modalVideo) return;

    let currentVideos = [];
    let currentIndex = 0;
    let currentCategoryName = '';

    // Load a video by index
    function loadVideo(index) {
        if (index < 0 || index >= currentVideos.length) return;
        currentIndex = index;

        modalVideo.pause();
        modalSource.src = currentVideos[index];
        modalVideo.load();
        modalVideo.play();

        // Update counter
        modalCounter.textContent = `${index + 1} / ${currentVideos.length}`;

        // Update nav buttons
        modalPrev.disabled = index === 0;
        modalNext.disabled = index === currentVideos.length - 1;
    }

    // Open modal
    function openModal(videos, categoryName) {
        currentVideos = videos;
        currentCategoryName = categoryName;
        modalCategory.textContent = categoryName;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        loadVideo(0);
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalVideo.pause();
        modalSource.src = '';
    }

    // Card click handlers
    const projectCards = document.querySelectorAll('.project-card[data-videos]');
    projectCards.forEach(card => {
        card.style.cursor = 'pointer';

        card.addEventListener('click', () => {
            const videos = JSON.parse(card.dataset.videos);
            const categoryName = card.querySelector('.project-title')?.textContent || '';
            openModal(videos, categoryName);
        });

        // Hover preview: play the thumbnail video on hover
        const thumbVideo = card.querySelector('.thumbnail-preview video');
        if (thumbVideo) {
            card.addEventListener('mouseenter', () => {
                thumbVideo.currentTime = 0;
                thumbVideo.play().catch(() => { });
            });
            card.addEventListener('mouseleave', () => {
                thumbVideo.pause();
                thumbVideo.currentTime = 0;
            });
        }
    });

    // Modal controls
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    modalPrev.addEventListener('click', () => loadVideo(currentIndex - 1));
    modalNext.addEventListener('click', () => loadVideo(currentIndex + 1));

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') loadVideo(currentIndex - 1);
        if (e.key === 'ArrowRight') loadVideo(currentIndex + 1);
    });
}

// Initialize gallery
document.addEventListener('DOMContentLoaded', initVideoGallery);

/* ========================================
   CONSOLE EASTER EGG
   ======================================== */

console.log('%c🎬 Usaid Shaikh - Visual Artist', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%cCrafting visual stories that captivate and inspire.', 'color: #3d6cb9; font-size: 14px;');
console.log('%c✉️ usaideditsvideos@gmail.com', 'color: #ffffff; font-size: 12px;');
