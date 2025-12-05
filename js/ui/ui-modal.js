/**
 * Modal Management
 * Handles all modal open/close operations and interactions
 */

/**
 * Toggle cart modal
 */
function toggleCart() {
    if (!cartModal) {
        console.error('Cart modal not found!');
        return;
    }
    
    cartModal.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = cartModal.classList.contains('active') ? 'hidden' : '';
    
    if (cartModal.classList.contains('active')) {
        // Close other modals
        if (wishlistModal) wishlistModal.classList.remove('active');
        if (productModal) productModal.classList.remove('active');
        if (checkoutModal) checkoutModal.classList.remove('active');
        if (mobileNav) mobileNav.classList.remove('active');
    }
}

/**
 * Toggle wishlist modal
 */
function toggleWishlistModal() {
    if (!wishlistModal) {
        console.error('Wishlist modal not found!');
        return;
    }
    
    wishlistModal.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = wishlistModal.classList.contains('active') ? 'hidden' : '';
    
    if (wishlistModal.classList.contains('active')) {
        // Close other modals
        if (cartModal) cartModal.classList.remove('active');
        if (productModal) productModal.classList.remove('active');
        if (checkoutModal) checkoutModal.classList.remove('active');
        if (mobileNav) mobileNav.classList.remove('active');
    }
}

/**
 * Toggle product modal
 */
function toggleProductModal() {
    if (!productModal) {
        console.error('Product modal not found!');
        return;
    }
    
    productModal.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = productModal.classList.contains('active') ? 'hidden' : '';
    
    if (productModal.classList.contains('active')) {
        // Close other modals
        if (cartModal) cartModal.classList.remove('active');
        if (wishlistModal) wishlistModal.classList.remove('active');
        if (checkoutModal) checkoutModal.classList.remove('active');
        if (mobileNav) mobileNav.classList.remove('active');
    } else {
        currentProductModal = null;
    }
}

/**
 * Toggle checkout modal
 */
function toggleCheckoutModal() {
    if (!checkoutModal) {
        console.error('Checkout modal not found!');
        return;
    }
    
    checkoutModal.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = checkoutModal.classList.contains('active') ? 'hidden' : '';
    
    if (checkoutModal.classList.contains('active')) {
        populateOrderSummary();
    } else {
        resetCheckoutForm();
    }
}

/**
 * Open product modal with product details
 */
function openProductModal(productId) {
    const product = productCatalog.find(p => p.id === productId);
    if (!product) return;

    currentProductModal = product;

    productModalName.textContent = product.name;
    productModalCategory.textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    productModalPrice.textContent = `₱${product.price.toLocaleString()}`;
    productModalDescription.textContent = product.description;
    
    productMainImage.src = product.image;
    productMainImage.alt = product.name;
    
    const allImages = [product.image, ...product.additionalImages];
    productThumbnails.innerHTML = allImages.map((img, index) => `
        <img src="${img}" alt="${product.name} ${index + 1}" class="product-thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
    `).join('');
    
    modalQuantity.textContent = '1';
    modalWishlistBtn.classList.toggle('active', wishlist.includes(product.id));
    
    document.querySelectorAll('.product-thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            productMainImage.src = allImages[index];
            document.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    toggleProductModal();
}

/**
 * Toggle mobile navigation
 */
function toggleMobileNav() {
    if (!mobileNav) return;
    
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}