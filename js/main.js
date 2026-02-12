/* ========================================
   PetPack.kz — Main JavaScript (Light Theme)
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 2800);
    });
    // Fallback
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 5000);

    // --- Scroll Progress Bar ---
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / docHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    });

    // --- Navigation Scroll ---
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // --- Mobile Menu ---
    const burger = document.getElementById('nav-burger');
    const navLinks = document.getElementById('nav-links');

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // --- Counter Animation (delayed until after preloader) ---
    const counters = document.querySelectorAll('[data-count]');

    function startCounters() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    animateCounter(el, target);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(el => counterObserver.observe(el));
    }

    // Start counters only after preloader is hidden
    setTimeout(startCounters, 2200);

    function animateCounter(el, target) {
        const duration = 3000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            el.textContent = current.toLocaleString('ru-RU');

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString('ru-RU');
            }
        }
        requestAnimationFrame(update);
    }


    // --- Products Horizontal Scroll (Mobile) ---
    const productsGrid = document.querySelector('.products-grid');
    const scrollDots = document.querySelectorAll('.scroll-dot');

    if (productsGrid && scrollDots.length) {
        productsGrid.addEventListener('scroll', () => {
            const scrollLeft = productsGrid.scrollLeft;
            const cardWidth = productsGrid.querySelector('.product-card').offsetWidth + 16;
            const activeIndex = Math.round(scrollLeft / cardWidth);

            scrollDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
            });
        });
    }

    // --- Testimonials Scroll (Mobile) ---
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    const testimonialDots = document.querySelectorAll('.testimonials-dot');

    if (testimonialsGrid && testimonialDots.length) {
        // Update dots on scroll
        testimonialsGrid.addEventListener('scroll', () => {
            const card = testimonialsGrid.querySelector('.testimonial-card');
            if (!card) return;
            const cardWidth = card.offsetWidth + 12;
            const activeIndex = Math.round(testimonialsGrid.scrollLeft / cardWidth);
            testimonialDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
            });
        });

        // Click on dot to scroll
        testimonialDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                const card = testimonialsGrid.querySelector('.testimonial-card');
                if (!card) return;
                const cardWidth = card.offsetWidth + 12;
                testimonialsGrid.scrollTo({ left: cardWidth * i, behavior: 'smooth' });
            });
        });

        // Auto-scroll every 4 seconds
        let autoScrollIndex = 0;
        const totalCards = testimonialsGrid.querySelectorAll('.testimonial-card').length;
        let autoScrollInterval = setInterval(() => {
            autoScrollIndex = (autoScrollIndex + 1) % totalCards;
            const card = testimonialsGrid.querySelector('.testimonial-card');
            if (!card) return;
            const cardWidth = card.offsetWidth + 12;
            testimonialsGrid.scrollTo({ left: cardWidth * autoScrollIndex, behavior: 'smooth' });
        }, 4000);

        // Pause auto-scroll on touch
        testimonialsGrid.addEventListener('touchstart', () => {
            clearInterval(autoScrollInterval);
        });
        testimonialsGrid.addEventListener('touchend', () => {
            const card = testimonialsGrid.querySelector('.testimonial-card');
            if (!card) return;
            const cardWidth = card.offsetWidth + 12;
            autoScrollIndex = Math.round(testimonialsGrid.scrollLeft / cardWidth);
            autoScrollInterval = setInterval(() => {
                autoScrollIndex = (autoScrollIndex + 1) % totalCards;
                testimonialsGrid.scrollTo({ left: cardWidth * autoScrollIndex, behavior: 'smooth' });
            }, 4000);
        });
    }

    // --- Hero Particles (Light Theme) ---
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        createParticles(particlesContainer, 40);
    }

    function createParticles(container, count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(0, 151, 167, ${Math.random() * 0.2 + 0.05});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 8 + 6}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(particle);
        }

        // Add keyframes for particle animation
        if (!document.getElementById('particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes particleFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
                    25% { transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) scale(1.2); opacity: 0.8; }
                    50% { transform: translate(${Math.random() * 80 - 40}px, ${Math.random() * 80 - 40}px) scale(0.8); opacity: 0.2; }
                    75% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.1); opacity: 0.6; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // --- Parallax on Hero ---
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
                heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
            }
        });
    }

    // --- Tilt Effect on Cards ---
    if (window.innerWidth > 768) {
        const tiltCards = document.querySelectorAll('.advantage-card, .service-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rotateX = (0.5 - y) * 8;
                const rotateY = (x - 0.5) * 8;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
                card.style.transition = 'transform 0.5s ease';
            });
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.1s ease';
            });
        });
    }

    // --- Contact Form ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;

            // Create WhatsApp message
            let whatsappMsg = `Здравствуйте! Меня зовут ${name}.\nМой номер: ${phone}`;
            if (message) {
                whatsappMsg += `\n${message}`;
            }

            const whatsappUrl = `https://wa.me/77779501511?text=${encodeURIComponent(whatsappMsg)}`;

            // Show success feedback
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                Отправлено!
            `;
            btn.style.background = '#25D366';

            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                contactForm.reset();
            }, 1000);
        });
    }

    // --- Active Nav Link Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // --- Typing Effect for Hero Title (subtle) ---
    const heroTitle = document.querySelector('.hero-title-accent');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 1s ease';
            heroTitle.style.opacity = '1';
        }, 800);
    }

    // --- CSS for fadeInUp animation ---
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .nav-link.active { color: var(--primary) !important; }
        .nav-link.active::after { width: 100% !important; }
    `;
    document.head.appendChild(fadeStyle);

});
