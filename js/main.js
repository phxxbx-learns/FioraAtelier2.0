/**
 * Main Application Entry Point
 * Initializes all components and sets up event listeners
 */

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

/**
 * Setup all event listeners for the application
 */
function setupEventListeners() {
    // Cart toggle
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
    }
    if (closeCart) {
        closeCart.addEventListener('click', toggleCart);
    }
    
    // Wishlist toggle
    if (wishlistIcon) {
        wishlistIcon.addEventListener('click', toggleWishlistModal);
    }
    if (closeWishlist) {
        closeWishlist.addEventListener('click', toggleWishlistModal);
    }
    
    // Product modal
    if (closeProductModal) {
        closeProductModal.addEventListener('click', toggleProductModal);
    }
    
    // Checkout modal
    if (closeCheckout) {
        closeCheckout.addEventListener('click', toggleCheckoutModal);
    }
    if (cancelCheckout) {
        cancelCheckout.addEventListener('click', toggleCheckoutModal);
    }
    
    // Mobile navigation
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileNav);
    }
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', toggleMobileNav);
    }
    
    // Mobile nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Close mobile nav
            toggleMobileNav();
            
            // Scroll to section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Overlay
    if (overlay) {
        overlay.addEventListener('click', function() {
            toggleCart();
            toggleWishlistModal();
            toggleProductModal();
            toggleCheckoutModal();
            toggleMobileNav();
        });
    }

    // Checkout form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }

    // Navigation filtering
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('href').substring(1);
            
            if (['best-sellers', 'fresh', 'synthetic', 'seasonal'].includes(targetId)) {
                currentCategory = targetId === 'best-sellers' ? 'all' : targetId;
                renderProducts();
            }
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            renderProducts();
        });
    }

    // Product interactions
    document.addEventListener('click', function(e) {
        // Add to cart button
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId);
        }

        // Quantity buttons
        if (e.target.classList.contains('quantity-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const isPlus = e.target.classList.contains('plus');
            updateProductQuantity(productId, isPlus);
        }

        // Wishlist buttons
        if (e.target.closest('.wishlist-btn')) {
            const wishlistBtn = e.target.closest('.wishlist-btn');
            const productId = parseInt(wishlistBtn.getAttribute('data-id'));
            toggleWishlist(productId, wishlistBtn);
        }

        // Product card click for modal
        if (e.target.closest('.product-card')) {
            const productCard = e.target.closest('.product-card');
            if (!e.target.closest('.product-actions')) {
                const productId = parseInt(productCard.getAttribute('data-id'));
                openProductModal(productId);
            }
        }
    });

    // Cart interactions
    document.addEventListener('click', function(e) {
        // Remove item from cart
        if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            const button = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
            const productId = parseInt(button.getAttribute('data-id'));
            removeFromCart(productId);
        }

        // Cart quantity buttons
        if (e.target.classList.contains('cart-quantity-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const isIncrease = e.target.classList.contains('increase');
            updateCartQuantity(productId, isIncrease);
        }
    });

    // Wishlist interactions
    if (wishlistItems) {
        wishlistItems.addEventListener('click', function(e) {
            if (e.target.classList.contains('move-to-cart') || e.target.closest('.move-to-cart')) {
                const button = e.target.classList.contains('move-to-cart') ? e.target : e.target.closest('.move-to-cart');
                const productId = parseInt(button.getAttribute('data-id'));
                moveToCart(productId);
            }
        
            // Remove from wishlist button
            if (e.target.classList.contains('remove-wishlist') || e.target.closest('.remove-wishlist')) {
                const button = e.target.classList.contains('remove-wishlist') ? e.target : e.target.closest('.remove-wishlist');
                const productId = parseInt(button.getAttribute('data-id'));
                removeFromWishlist(productId);
            }        
        });
    }

    // Product modal interactions
    if (modalMinus) {
        modalMinus.addEventListener('click', function() {
            let quantity = parseInt(modalQuantity.textContent);
            if (quantity > 1) {
                modalQuantity.textContent = quantity - 1;
            }
        });
    }

    if (modalPlus) {
        modalPlus.addEventListener('click', function() {
            let quantity = parseInt(modalQuantity.textContent);
            modalQuantity.textContent = quantity + 1;
        });
    }

    if (modalAddToCart) {
        modalAddToCart.addEventListener('click', function() {
            if (currentProductModal) {
                const quantity = parseInt(modalQuantity.textContent);
                addToCart(currentProductModal.id, quantity);
                toggleProductModal();
            }
        });
    }

    if (modalWishlistBtn) {
        modalWishlistBtn.addEventListener('click', function() {
            if (currentProductModal) {
                toggleWishlist(currentProductModal.id, modalWishlistBtn);
                const productCardBtn = document.querySelector(`.wishlist-btn[data-id="${currentProductModal.id}"]`);
                if (productCardBtn) {
                    productCardBtn.classList.toggle('active', wishlist.includes(currentProductModal.id));
                }
            }
        });
    }

    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }

    // Undo button
    if (undoBtn) {
        undoBtn.addEventListener('click', undoLastAction);
    }

    // Search functionality with debounce
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }
}

/**
 * Initialize the application
 */
function init() {
    console.log('Initializing application...');
    console.log('Cart data from localStorage:', localStorage.getItem('fioraCart'));
    console.log('Wishlist data from localStorage:', localStorage.getItem('fioraWishlist'));
    
    // Initialize global instances
    initializeGlobalInstances();
    
    // Load data from storage
    loadCartFromStorage();
    loadWishlistFromStorage();
    
    // Initialize UI components
    renderAllProducts();
    setupEventListeners();
    setupWishlistEventListeners();
    updateCartUI();
    updateWishlistUI();
    initCheckout();
    initGallery();
    initEnhancedHero();
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);