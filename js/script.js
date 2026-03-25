/* ==========================================
   BRITISH ACADEMY THE COACH — MAIN SCRIPTS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== NAVBAR: Sticky + Scroll Effect =====
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.navbar__link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== NAVBAR: Mobile Toggle =====
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ===== NAVBAR: Active Link on Scroll =====
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ===== HERO: Counter Animation =====
    const counters = document.querySelectorAll('[data-count]');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });

        countersAnimated = true;
    }

    // Trigger counter when hero section is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero__stats');
    if (heroStats) heroObserver.observe(heroStats);

    // ===== TESTIMONIALS: Carousel =====
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('testimonialDots');
    const testimonialCards = track ? track.querySelectorAll('.testimonial-card') : [];

    let currentSlide = 0;
    let slidesPerView = 3;
    let totalSlides = 0;

    function updateSlidesPerView() {
        if (window.innerWidth < 768) {
            slidesPerView = 1;
        } else if (window.innerWidth < 1024) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
        totalSlides = Math.max(0, testimonialCards.length - slidesPerView + 1);
        if (currentSlide >= totalSlides) currentSlide = Math.max(0, totalSlides - 1);
        updateCarousel();
        createDots();
    }

    function updateCarousel() {
        if (!track || testimonialCards.length === 0) return;
        const cardWidth = testimonialCards[0].offsetWidth + 16; // card width + gap
        track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
        updateDots();
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('testimonials__dot');
            if (i === currentSlide) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.testimonials__dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
            updateCarousel();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
            updateCarousel();
        });
    }

    // Auto-slide every 5 seconds
    let autoSlide = setInterval(() => {
        if (totalSlides > 0) {
            currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
            updateCarousel();
        }
    }, 5000);

    // Pause auto-slide on hover
    if (track) {
        track.addEventListener('mouseenter', () => clearInterval(autoSlide));
        track.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                if (totalSlides > 0) {
                    currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
                    updateCarousel();
                }
            }, 5000);
        });
    }

    window.addEventListener('resize', updateSlidesPerView);
    updateSlidesPerView();

    // ===== FAQ: Accordion =====
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked (if wasn't active)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ===== CONTACT FORM: Validation + WhatsApp Redirect =====
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const course = document.getElementById('course').value;
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !phone || !course) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Phone validation
            const phoneRegex = /^[\+]?[0-9\s\-]{10,15}$/;
            if (!phoneRegex.test(phone)) {
                showFormMessage('Please enter a valid phone number.', 'error');
                return;
            }

            // Build WhatsApp message
            let waMessage = `Hi, I'm interested in enrolling at British Academy The Coach.\n\n`;
            waMessage += `*Name:* ${name}\n`;
            waMessage += `*Phone:* ${phone}\n`;
            if (email) waMessage += `*Email:* ${email}\n`;
            waMessage += `*Course:* ${course.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}\n`;
            if (message) waMessage += `*Message:* ${message}\n`;

            const waUrl = `https://wa.me/919495455144?text=${encodeURIComponent(waMessage)}`;

            showFormMessage('Redirecting to WhatsApp...', 'success');

            setTimeout(() => {
                window.open(waUrl, '_blank');
                contactForm.reset();
            }, 800);
        });
    }

    function showFormMessage(text, type) {
        // Remove existing message
        const existing = document.querySelector('.form__message');
        if (existing) existing.remove();

        const msg = document.createElement('div');
        msg.className = `form__message form__message--${type}`;
        msg.textContent = text;
        msg.style.cssText = `
            padding: 12px 20px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-weight: 500;
            font-size: 0.9rem;
            text-align: center;
            ${type === 'error'
                ? 'background: #FDE8EC; color: #C8102E; border: 1px solid #F5C6CB;'
                : 'background: #D4EDDA; color: #155724; border: 1px solid #C3E6CB;'}
        `;

        contactForm.insertBefore(msg, contactForm.firstChild);

        // Auto-remove after 4 seconds
        setTimeout(() => msg.remove(), 4000);
    }

    // ===== BACK TO TOP =====
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== SCROLL REVEAL ANIMATIONS =====
    const animatedElements = document.querySelectorAll('[data-animate]');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => scrollObserver.observe(el));

    // ===== SMOOTH SCROLL for all anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
