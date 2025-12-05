/**
 * Hero Section Management
 * Handles cherry blossom animation and counter animations
 */

/**
 * Create cherry blossom animation elements
 * Creates 100 cherry blossoms that fall across the entire screen width
 */
function createCherryBlossoms() {
    const container = document.getElementById('cherry-blossom-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create 100 cherry blossoms for better coverage
    for (let i = 0; i < 100; i++) {
        const blossom = document.createElement('div');
        blossom.className = 'cherry-blossom';
        
        // Random style for variety
        const style = Math.floor(Math.random() * 3) + 1;
        blossom.classList.add(`style-${style}`);
        
        // Random positions across ENTIRE width
        const startX = (Math.random() * 100); // 0% to 100% - covers entire width
        const endX = startX + (Math.random() * 40 - 20); // -20% to +20% movement
        
        // Random animation properties
        const duration = Math.random() * 15 + 10; // 10-25 seconds
        const delay = Math.random() * 25; // 0-25 second delay
        const size = Math.random() * 0.7 + 0.6; // 0.6x to 1.3x size
        
        blossom.style.setProperty('--start-x', `${startX}vw`); // Use vw units for full width
        blossom.style.setProperty('--end-x', `${endX}vw`);
        blossom.style.animationDuration = `${duration}s`;
        blossom.style.animationDelay = `${delay}s`;
        blossom.style.transform = `scale(${size})`;
        
        container.appendChild(blossom);
    }
}

/**
 * Animate counting numbers with intersection observer
 * Animates numbers when they come into viewport
 */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current).toLocaleString() + '+';
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target.toLocaleString() + '+';
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

/**
 * Initialize enhanced hero section
 */
function initEnhancedHero() {
    createCherryBlossoms();
    animateCounters();
    
    // Recreate cherry blossoms every 45 seconds for variety
    setInterval(createCherryBlossoms, 45000);
}