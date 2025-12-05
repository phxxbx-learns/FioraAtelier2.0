/**
 * Wishlist UI Management
 * Handles all wishlist-related user interface operations
 */

/**
 * Update wishlist UI with current wishlist state
 */
function updateWishlistUI() {
    const wishlistEmpty = document.getElementById('wishlist-empty');
    const wishlistActions = document.getElementById('wishlist-actions');
    const items = productCatalog.filter(product => wishlist.includes(product.id));
    
    if (wishlistCount) wishlistCount.textContent = items.length;
    
    if (items.length === 0) {
        if (wishlistItems) wishlistItems.style.display = 'none';
        if (wishlistActions) wishlistActions.style.display = 'none';
        if (wishlistEmpty) wishlistEmpty.classList.add('active');
    } else {
        if (wishlistItems) {
            wishlistItems.style.display = 'grid';
            wishlistItems.innerHTML = items.map(product => `
                <div class="wishlist-item">
                    <img src="${product.image}" alt="${product.name}" class="wishlist-item-image">
                    <div class="wishlist-item-content">
                        <div class="wishlist-item-details">
                            <div class="wishlist-item-name">${product.name}</div>
                            <div class="wishlist-item-category">${product.category.replace('-', ' ')}</div>
                            <div class="wishlist-item-price">₱${product.price.toLocaleString()}</div>
                        </div>
                        <div class="wishlist-item-actions">
                            <button class="move-to-cart" data-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i>
                                Add to Cart
                            </button>
                            <button class="remove-wishlist" data-id="${product.id}" title="Remove from wishlist">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        if (wishlistActions) wishlistActions.style.display = 'flex';
        if (wishlistEmpty) wishlistEmpty.classList.remove('active');
    }
}

/**
 * Toggle product in wishlist
 */
function toggleWishlist(productId, button) {
    const product = productCatalog.find(p => p.id === productId);
    if (!product) return;

    const index = wishlist.indexOf(productId);
    if (index === -1) {
        wishlist.push(productId);
        if (button) button.classList.add('active');
        showToast(`${product.name} added to wishlist`);
    } else {
        wishlist.splice(index, 1);
        if (button) button.classList.remove('active');
        showToast(`${product.name} removed from wishlist`);
    }
    
    updateWishlistUI();
    saveWishlistToStorage();
}

/**
 * Move product from wishlist to cart
 */
function moveToCart(productId) {
    const product = productCatalog.find(p => p.id === productId);
    if (!product) return;

    shoppingCart.addItem(product, 1);
    actionHistory.push({
        type: 'add',
        productId: productId,
        quantity: 1
    });

    const index = wishlist.indexOf(productId);
    if (index !== -1) {
        wishlist.splice(index, 1);
    }

    updateCartUI();
    updateWishlistUI();
    
    const wishlistBtn = document.querySelector(`.wishlist-btn[data-id="${productId}"]`);
    if (wishlistBtn) {
        wishlistBtn.classList.remove('active');
    }
    
    showToast(`${product.name} moved to cart`);
}

/**
 * Remove product from wishlist
 */
function removeFromWishlist(productId) {
    const product = productCatalog.find(p => p.id === productId);
    if (!product) return;

    const index = wishlist.indexOf(productId);
    if (index !== -1) {
        wishlist.splice(index, 1);
    }

    updateWishlistUI();
    saveWishlistToStorage();
    
    // Update wishlist buttons on product cards
    const wishlistBtn = document.querySelector(`.wishlist-btn[data-id="${productId}"]`);
    if (wishlistBtn) {
        wishlistBtn.classList.remove('active');
    }
    
    showToast(`${product.name} removed from wishlist`);
}

/**
 * Clear entire wishlist
 */
function clearWishlist() {
    if (wishlist.length === 0) return;
    
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
        wishlist = [];
        updateWishlistUI();
        saveWishlistToStorage();
        showToast('Wishlist cleared');
        
        // Update all wishlist buttons on the page
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }
}

/**
 * Share wishlist functionality
 */
function shareWishlist() {
    const items = productCatalog.filter(product => wishlist.includes(product.id));
    
    if (items.length === 0) {
        showToast('Your wishlist is empty!');
        return;
    }
    
    const wishlistText = items.map(item => `• ${item.name} - ₱${item.price.toLocaleString()}`).join('\n');
    const shareText = `My Flower Wishlist from Fiora Atelier:\n\n${wishlistText}\n\nTotal: ${items.length} items`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Flower Wishlist',
            text: shareText,
            url: window.location.href
        }).catch(() => {
            copyToClipboard(shareText);
        });
    } else {
        copyToClipboard(shareText);
    }
}

/**
 * Copy to clipboard utility
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Wishlist copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Wishlist copied to clipboard!');
    });
}

/**
 * Setup wishlist event listeners
 */
function setupWishlistEventListeners() {
    // Clear wishlist button
    const clearWishlistBtn = document.getElementById('clear-wishlist');
    if (clearWishlistBtn) {
        clearWishlistBtn.addEventListener('click', clearWishlist);
    }
    
    // Share wishlist button
    const shareWishlistBtn = document.getElementById('share-wishlist');
    if (shareWishlistBtn) {
        shareWishlistBtn.addEventListener('click', shareWishlist);
    }
}

/**
 * Handle wishlist item interactions (move to cart and remove)
 * This should be called after the wishlist UI is updated
 */
function handleWishlistItemInteractions() {
    // Use event delegation for dynamically created wishlist items
    document.addEventListener('click', function(e) {
        // Move to cart button
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