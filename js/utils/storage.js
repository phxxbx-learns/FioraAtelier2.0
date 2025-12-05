/**
 * Local Storage Utilities
 * Handles saving and loading cart/wishlist data from browser storage
 */

/**
 * Save cart data to localStorage
 */
function saveCartToStorage() {
    const cartData = {
        items: shoppingCart.getItems().map(item => ({
            productId: item.product.id,
            quantity: item.quantity
        })),
        total: shoppingCart.total,
        size: shoppingCart.size
    };
    localStorage.setItem('fioraCart', JSON.stringify(cartData));
}

/**
 * Save wishlist data to localStorage
 */
function saveWishlistToStorage() {
    localStorage.setItem('fioraWishlist', JSON.stringify(wishlist));
}

/**
 * Load cart data from localStorage
 */
function loadCartFromStorage() {
    const cartData = localStorage.getItem('fioraCart');
    if (cartData) {
        const parsedData = JSON.parse(cartData);
        
        // Reconstruct cart from stored data
        parsedData.items.forEach(itemData => {
            const product = productCatalog.find(p => p.id === itemData.productId);
            if (product) {
                shoppingCart.addItem(product, itemData.quantity);
            }
        });
    }
}

/**
 * Load wishlist data from localStorage
 */
function loadWishlistFromStorage() {
    const wishlistData = localStorage.getItem('fioraWishlist');
    if (wishlistData) {
        wishlist = JSON.parse(wishlistData);
    }
}