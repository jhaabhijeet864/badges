// Script to handle badge click events
document.addEventListener('DOMContentLoaded', function() {
    // Get all badge elements
    const badges = document.querySelectorAll('.badge');
    
    // Add click event listener to each badge
    badges.forEach(badge => {
        badge.addEventListener('click', function(event) {
            // Stop event from bubbling up to document
            event.stopPropagation();
            
            // If this badge is already active, deactivate it
            if (this.classList.contains('active')) {
                this.classList.remove('active');
            } else {
                // Otherwise, first deactivate all badges
                badges.forEach(b => b.classList.remove('active'));
                // Then activate this badge
                this.classList.add('active');
            }
        });
    });
    
    // Close active badge when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.badge')) {
            badges.forEach(badge => badge.classList.remove('active'));
        }
    });

    // Initialize holomorphic background
    initHolomorphicBackground();
});

// Function to create holomorphic background
function initHolomorphicBackground() {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'background-canvas';
    document.body.prepend(canvas);
    
    // Style the canvas
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.3';
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse position tracking
    let mouse = {
        x: undefined,
        y: undefined,
        radius: 100
    };
    
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Animation variables
    const particles = [];
    const particleCount = 50;
    const maxSize = 30;
    const colors = ['#58a6ff', '#238636', '#8957e5', '#f78166'];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * maxSize + 5,
            baseSize: Math.random() * maxSize + 5,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 1 - 0.5,
            baseSpeedX: Math.random() * 1 - 0.5,
            baseSpeedY: Math.random() * 1 - 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.5 + 0.1,
            baseOpacity: Math.random() * 0.5 + 0.1
        });
    }
    
    // Animation function
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            // Check distance from mouse
            let dx = mouse.x - particle.x;
            let dy = mouse.y - particle.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let maxDistance = mouse.radius;
            
            // Particle behavior based on mouse proximity
            if (distance < maxDistance) {
                // Calculate intensity based on distance (closer = stronger effect)
                let intensity = 1 - (distance / maxDistance);
                
                // Attract towards mouse
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (maxDistance - distance) / maxDistance;
                
                // Update particle properties based on mouse proximity
                particle.speedX = particle.baseSpeedX + (forceDirectionX * force * 2);
                particle.speedY = particle.baseSpeedY + (forceDirectionY * force * 2);
                
                // Increase size and opacity when close to mouse
                particle.size = particle.baseSize * (1 + intensity * 0.5);
                particle.opacity = Math.min(1, particle.baseOpacity + intensity * 0.5);
            } else {
                // Gradually return to base values when away from mouse
                particle.speedX = particle.speedX * 0.98 + particle.baseSpeedX * 0.02;
                particle.speedY = particle.speedY * 0.98 + particle.baseSpeedY * 0.02;
                particle.size = particle.size * 0.95 + particle.baseSize * 0.05;
                particle.opacity = particle.opacity * 0.95 + particle.baseOpacity * 0.05;
            }
            
            // Move particle
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Handle edge cases
            if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
            if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
            if (particle.y > canvas.height + particle.size) particle.y = -particle.size;
            if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
            ctx.fill();
            
            // Draw glow (stronger when near mouse)
            const glowSize = particle.size * (2 + (particle.opacity - particle.baseOpacity) * 2);
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, glowSize
            );
            gradient.addColorStop(0, particle.color + '55');
            gradient.addColorStop(1, particle.color + '00');
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        });
        
        // Continue animation
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
}
