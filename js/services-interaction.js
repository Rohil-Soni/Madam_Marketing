// ============================================
// SERVICES ACCORDION INTERACTION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Service items toggle
    const serviceItems = document.querySelectorAll('.service-item');

    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            serviceItems.forEach(si => si.classList.remove('active'));

            // Toggle clicked
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ============================================
    // FAQ ACCORDION
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(fi => fi.classList.remove('active'));

            // Toggle clicked
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ============================================
    // SCROLL REVEAL (IntersectionObserver)
    // ============================================
    const revealElements = document.querySelectorAll(
        '.about-section, .showcase-section, .services-header, .services-list, ' +
        '.process-header, .stack-wrap, .clients-header, .marquee-wrapper, ' +
        '.faq-header, .faq-list, .cta-content, .footer-grid'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Add stagger to certain grids
    const staggerTargets = document.querySelectorAll('.services-list');
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('stagger-children', 'visible');
                staggerObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    staggerTargets.forEach(el => {
        el.classList.add('stagger-children');
        staggerObserver.observe(el);
    });

    // ============================================
    // SECOND BOOK CALL BUTTON
    // ============================================
    const bookCallBtn2 = document.getElementById('bookCallBtn2');
    if (bookCallBtn2) {
        bookCallBtn2.addEventListener('click', () => {
            const modal = document.getElementById('bookingModal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                // Trigger calendar init if available
                if (typeof initializeCalendar === 'function') {
                    initializeCalendar();
                }
            }
        });
    }

    // ============================================
    // SCROLL TEXT REVEAL (reading animation)
    // rAF-gated to prevent layout thrashing
    // ============================================
    function wrapWordsInNode(node) {
        const childNodes = Array.from(node.childNodes);

        childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent;
                if (!text.trim()) return;
                const parts = text.split(/(\s+)/);
                const fragment = document.createDocumentFragment();

                parts.forEach(part => {
                    if (part.trim() === '') {
                        fragment.appendChild(document.createTextNode(part));
                    } else {
                        const span = document.createElement('span');
                        span.className = 'word';
                        span.textContent = part;
                        fragment.appendChild(span);
                    }
                });

                child.replaceWith(fragment);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                wrapWordsInNode(child);
            }
        });
    }

    const textRevealElements = document.querySelectorAll('[data-text-reveal]');

    // Pre-cache word NodeLists once (avoid re-querying on every frame)
    const textRevealData = [];
    textRevealElements.forEach(el => {
        wrapWordsInNode(el);
        el.classList.add('text-reveal');
        textRevealData.push({
            el: el,
            words: el.querySelectorAll('.word'),
            prevActiveCount: -1  // Track last state to skip redundant DOM writes
        });
    });

    let textRevealTicking = false;

    function updateTextReveal() {
        const windowHeight = window.innerHeight;

        // Batch all reads first (no interleaved writes)
        const rects = textRevealData.map(data => data.el.getBoundingClientRect());

        // Now batch all writes
        const start = windowHeight * 0.85;
        const end = windowHeight * 0.15;
        const range = start - end;

        for (let i = 0; i < textRevealData.length; i++) {
            const data = textRevealData[i];
            const rect = rects[i];
            const progress = Math.max(0, Math.min(1, (start - rect.top) / range));
            const activeCount = Math.ceil(progress * data.words.length);

            // Skip if nothing changed since last frame
            if (activeCount === data.prevActiveCount) continue;
            data.prevActiveCount = activeCount;

            for (let j = 0; j < data.words.length; j++) {
                if (j < activeCount) {
                    if (!data.words[j].classList.contains('active')) {
                        data.words[j].classList.add('active');
                    }
                } else {
                    if (data.words[j].classList.contains('active')) {
                        data.words[j].classList.remove('active');
                    }
                }
            }
        }

        textRevealTicking = false;
    }

    function onScrollTextReveal() {
        if (!textRevealTicking) {
            textRevealTicking = true;
            requestAnimationFrame(updateTextReveal);
        }
    }

    window.addEventListener('scroll', onScrollTextReveal, { passive: true });
    updateTextReveal();
});
