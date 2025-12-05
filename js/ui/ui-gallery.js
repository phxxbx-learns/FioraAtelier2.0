/**
 * Gallery Management
 * Handles gallery filtering and lightbox functionality
 */

/**
 * Initialize gallery functionality
 */
function initGallery() {
    let filterBtns = document.querySelectorAll('.filter-btn');
    let galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    let galleryImages = [];

    /**
     * Refresh gallery items (call this after adding new items)
     */
    function refreshGalleryItems() {
        galleryItems = document.querySelectorAll('.gallery-item');
        galleryImages = []; // Clear existing images
        
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            const title = item.querySelector('h4');
            const description = item.querySelector('p');
            
            if (img && title && description) {
                galleryImages.push({
                    src: img.src,
                    title: title.textContent,
                    description: description.textContent
                });
            }
        });
    }

    // Initialize gallery images
    refreshGalleryItems();

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    // Force reflow
                    void item.offsetWidth;
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /**
     * Setup lightbox events
     */
    function setupLightboxEvents() {
        galleryItems.forEach((item, index) => {
            const viewBtn = item.querySelector('.gallery-view-btn');
            
            // Remove existing event listeners
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            // Get fresh references
            const freshItem = document.querySelectorAll('.gallery-item')[index];
            const freshViewBtn = freshItem.querySelector('.gallery-view-btn');
            
            // Click on view button
            freshViewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openLightbox(index);
            });

            // Click on gallery item
            freshItem.addEventListener('click', () => {
                openLightbox(index);
            });
        });
    }

    setupLightboxEvents();

    /**
     * Open lightbox with specific image
     */
    function openLightbox(index) {
        if (index >= galleryImages.length) return;
        
        currentImageIndex = index;
        const image = galleryImages[index];
        
        lightboxImage.src = image.src;
        lightboxTitle.textContent = image.title;
        lightboxDescription.textContent = image.description;
        
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close lightbox
     */
    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Navigate through lightbox images
     */
    function navigateLightbox(direction) {
        currentImageIndex += direction;
        
        if (currentImageIndex < 0) {
            currentImageIndex = galleryImages.length - 1;
        } else if (currentImageIndex >= galleryImages.length) {
            currentImageIndex = 0;
        }
        
        const image = galleryImages[currentImageIndex];
        lightboxImage.src = image.src;
        lightboxTitle.textContent = image.title;
        lightboxDescription.textContent = image.description;
    }

    // Event listeners for lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close lightbox on overlay click
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Public function to refresh gallery (call this after adding new items dynamically)
    window.refreshGallery = function() {
        refreshGalleryItems();
        setupLightboxEvents();
        filterBtns = document.querySelectorAll('.filter-btn'); // Refresh buttons too
    };
}