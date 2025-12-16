// Interactive 3D Card Tilt Effect with Distance-Based Smooth Transitions
document.addEventListener('DOMContentLoaded', function() {
    const card = document.querySelector('.title-card');
    
    if (card) {
        let currentRotateX = 0;
        let currentRotateY = 0;
        let currentTranslateZ = 0;
        let currentScale = 1;
        let animationFrameId = null;
        
        // Smooth animation loop
        function animate() {
            card.style.transform = `perspective(1500px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) translateZ(${currentTranslateZ}px) scale(${currentScale})`;
            animationFrameId = requestAnimationFrame(animate);
        }
        
        // Mouse move handler for 3D tilt
        card.addEventListener('mousemove', function(e) {
            // Set cursor glow size larger when on card
            document.body.style.setProperty('--cursor-size', '1px');
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate distance from center (0 to 1)
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            const distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Distance-based intensity (closer to center = less tilt)
            const intensityFactor = Math.min(distanceFromCenter, 1);
            
            // Calculate rotation angles with distance-based intensity
            const maxTilt = 8; // Maximum tilt angle in degrees
            const targetRotateX = (deltaY * maxTilt * intensityFactor);
            const targetRotateY = (deltaX * maxTilt * intensityFactor);
            
            // Calculate Z-axis depth with distance consideration
            const distanceFromCenterX = Math.abs(x - centerX);
            const isNearHorizontalCenter = distanceFromCenterX < rect.width / 6;
            
            let targetTranslateZ = 0;
            if (isNearHorizontalCenter) {
                const depthIntensity = intensityFactor * 15;
                if (y < centerY) {
                    targetTranslateZ = -(deltaY * depthIntensity);
                } else {
                    targetTranslateZ = (deltaY * depthIntensity);
                }
            }
            
            // Target scale based on distance from center
            const targetScale = 1 + (intensityFactor * 0.03);
            
            // Ultra smooth interpolation with adaptive smoothing
            const baseSmoothFactor = 0.08;
            const distanceSmooth = baseSmoothFactor * (1 - intensityFactor * 0.3);
            
            currentRotateX += (targetRotateX - currentRotateX) * distanceSmooth;
            currentRotateY += (targetRotateY - currentRotateY) * distanceSmooth;
            currentTranslateZ += (targetTranslateZ - currentTranslateZ) * distanceSmooth;
            currentScale += (targetScale - currentScale) * distanceSmooth;
            
            // Calculate percentages for gradient effect
            const percentX = (x / rect.width) * 100;
            const percentY = (y / rect.height) * 100;
            
            // Update CSS variables for dynamic lighting
            card.style.setProperty('--x', `${percentX}%`);
            card.style.setProperty('--y', `${percentY}%`);
            
            // Start animation loop if not running
            if (!animationFrameId) {
                animate();
            }
        });
        
        // Reset on mouse leave with ultra smooth animation
        card.addEventListener('mouseleave', function() {
            // Reset cursor glow size back to smaller when leaving card
            document.body.style.setProperty('--cursor-size', '1px');
            
            // Stop current animation loop
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            
            // Smoothly reset to original state
            function resetAnimation() {
                const resetSpeed = 0.12;
                currentRotateX += (0 - currentRotateX) * resetSpeed;
                currentRotateY += (0 - currentRotateY) * resetSpeed;
                currentTranslateZ += (0 - currentTranslateZ) * resetSpeed;
                currentScale += (1 - currentScale) * resetSpeed;
                
                card.style.transform = `perspective(1500px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) translateZ(${currentTranslateZ}px) scale(${currentScale})`;
                
                // Stop when close enough to original
                if (Math.abs(currentRotateX) < 0.01 && Math.abs(currentRotateY) < 0.01 && Math.abs(currentTranslateZ) < 0.1 && Math.abs(currentScale - 1) < 0.001) {
                    currentRotateX = 0;
                    currentRotateY = 0;
                    currentTranslateZ = 0;
                    currentScale = 1;
                    card.style.transform = 'perspective(1500px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
                    return;
                }
                
                requestAnimationFrame(resetAnimation);
            }
            
            resetAnimation();
        });
        
        // Remove transition on mouse enter for smooth tracking
        card.addEventListener('mouseenter', function() {
            card.style.transition = 'none';
        });
    }
});