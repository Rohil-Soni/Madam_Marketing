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