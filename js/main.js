// Create cursor circle element
const cursorCircle = document.createElement('div');
cursorCircle.classList.add('cursor-circle');
document.body.appendChild(cursorCircle);

let circleX = 0;
let circleY = 0;
let mouseX = 0;
let mouseY = 0;

// Global Cursor Glow Effect — only write CSS vars (paint-only, no layout)
document.addEventListener('mousemove', (e) => {
    document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    
    mouseX = e.clientX;
    mouseY = e.clientY;
}, { passive: true });

document.addEventListener('mouseenter', () => {
    document.body.style.setProperty('--cursor-opacity', '1');
    cursorCircle.classList.add('active');
}, { passive: true });

document.addEventListener('mouseleave', () => {
    document.body.style.setProperty('--cursor-opacity', '0');
    cursorCircle.classList.remove('active');
}, { passive: true });

// Nav proximity check — cache the nav element and its rect
let isCurrentlyInNav = false;
const navEl = document.querySelector('nav');
let cachedNavRect = navEl ? navEl.getBoundingClientRect() : null;

function invalidateNavCache() {
    cachedNavRect = null;
}

function checkNavBarProximity() {
    if (!navEl) return;
    
    // Re-measure only when cache is invalidated (scroll/resize)
    if (!cachedNavRect) {
        cachedNavRect = navEl.getBoundingClientRect();
    }
    
    const isInNavBar = (
        mouseX >= cachedNavRect.left &&
        mouseX <= cachedNavRect.right &&
        mouseY >= cachedNavRect.top &&
        mouseY <= cachedNavRect.bottom
    );
    
    if (isInNavBar && !isCurrentlyInNav) {
        isCurrentlyInNav = true;
        cursorCircle.classList.add('hovering-link');
    } else if (!isInNavBar && isCurrentlyInNav) {
        isCurrentlyInNav = false;
        cursorCircle.classList.remove('hovering-link');
    }
}

// Invalidate nav rect cache on scroll and resize
window.addEventListener('scroll', invalidateNavCache, { passive: true });
window.addEventListener('resize', invalidateNavCache, { passive: true });

// Single combined rAF loop for cursor + nav proximity
// Uses transform (composite-only) instead of left/top (layout-trigger)
function animateLoop() {
    const speed = cursorCircle.classList.contains('hovering-link') ? 0.12 : 0.08;
    
    circleX += (mouseX - circleX) * speed;
    circleY += (mouseY - circleY) * speed;
    
    // Write transform only — no layout properties touched
    cursorCircle.style.transform = `translate3d(${circleX}px, ${circleY}px, 0) translate(-50%, -50%)`;
    
    checkNavBarProximity();
    requestAnimationFrame(animateLoop);
}

animateLoop();

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Smooth scroll and close menu when clicking navigation links
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Batch reads only — no interleaved writes
            const navHeight = navEl ? navEl.offsetHeight : 0;
            const rect = targetSection.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const offset = navHeight + 20;
            const targetPosition = rect.top + scrollTop - offset;
            
            // Single write — no layout thrashing
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});