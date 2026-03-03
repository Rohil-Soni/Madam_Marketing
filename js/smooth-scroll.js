// Back to Top Button — uses IntersectionObserver instead of scroll listener
const backToTop = document.getElementById('backToTop');

// Observe a sentinel element (hero section or a pixel threshold)
// When hero scrolls out of view, show the button; when in view, hide it
const heroSection = document.getElementById('home');

if (heroSection && backToTop) {
    const backToTopObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                backToTop.classList.remove('visible');
            } else {
                backToTop.classList.add('visible');
            }
        });
    }, {
        threshold: 0,
        rootMargin: '0px'
    });

    backToTopObserver.observe(heroSection);
}

// Scroll to top when clicked
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}