// Create cursor circle element
const cursorCircle = document.createElement('div');
cursorCircle.classList.add('cursor-circle');
document.body.appendChild(cursorCircle);

let circleX = 0;
let circleY = 0;
let mouseX = 0;
let mouseY = 0;

// Global Cursor Glow Effect
document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('body::after');
    document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    
    mouseX = e.clientX;
    mouseY = e.clientY;
});

document.addEventListener('mouseenter', () => {
    document.body.style.setProperty('--cursor-opacity', '1');
    cursorCircle.classList.add('active');
});

document.addEventListener('mouseleave', () => {
    document.body.style.setProperty('--cursor-opacity', '0');
    cursorCircle.classList.remove('active');
});

// Smooth circle following with delay
function animateCircle() {
        const speed = cursorCircle.classList.contains('hovering-link') ? 0.12 : 0.08; // Faster on hover for responsiveness
    
    circleX += (mouseX - circleX) * speed;
    circleY += (mouseY - circleY) * speed;
    
    document.body.style.setProperty('--circle-x', `${circleX}px`);
    document.body.style.setProperty('--circle-y', `${circleY}px`);
    
    requestAnimationFrame(animateCircle);
}

animateCircle();

// Add hover effect for nav links and interactive elements
document.querySelectorAll('.nav-menu a, button, .cta-button, a').forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursorCircle.classList.add('hovering-link');
    });
    
    element.addEventListener('mouseleave', () => {
        cursorCircle.classList.remove('hovering-link');
    });
});

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
        
        // Get the target section
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        // Smooth scroll to section - always scroll, even if already there
        if (targetSection) {
            // Force the element to be non-sticky temporarily to get true position
            const originalPosition = targetSection.style.position;
            targetSection.style.position = 'relative';
            
            const navHeight = document.querySelector('nav').offsetHeight;
            const offset = navHeight + 20;
            
            // Get absolute position from top of document
            const rect = targetSection.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetPosition = rect.top + scrollTop - offset;
            
            // Restore original position
            targetSection.style.position = originalPosition;
            
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