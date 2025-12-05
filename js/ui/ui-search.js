/**
 * Search Functionality
 * Handles product search with debouncing and highlighting
 */

let searchTimeout;

/**
 * Perform search across all products with debouncing
 * Uses linear search algorithm O(n) across all product properties
 */
function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(() => {
        if (query === '') {
            renderAllProducts();
            return;
        }

        if (query.length > 0) {
            productContainer.innerHTML = `
                <div class="search-loading" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <div class="loading-spinner" style="margin: 0 auto;"></div>
                    <p>Searching for "${query}"...</p>
                </div>
            `;
        }

        // Search across ALL categories and ALL seasonal products
        const allProducts = [
            ...productCatalog,
            ...(window.fallProducts || []),
            ...(window.springProducts || []),
            ...(window.summerProducts || []),
            ...(window.winterProducts || [])
        ];

        // Linear search through all products
        const filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query)))
        );

        productContainer.innerHTML = filteredProducts.length > 0 
            ? filteredProducts.map(product => `
                <div class="product-card" data-id="${product.id}" data-category="${product.category}">
                    ${product.category === 'best-sellers' ? '<div class="product-badge">Bestseller</div>' : ''}
                    ${product.category === 'fall' ? '<div class="product-badge" style="background: #8B4513;">Autumn</div>' : ''}
                    ${product.category === 'spring' ? '<div class="product-badge" style="background: #90EE90;">Spring</div>' : ''}
                    ${product.category === 'summer' ? '<div class="product-badge" style="background: #FFD700;">Summer</div>' : ''}
                    ${product.category === 'winter' ? '<div class="product-badge" style="background: #87CEEB;">Winter</div>' : ''}
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-description">${product.description.substring(0, 80)}...</div>
                        <div class="product-price">₱${product.price.toLocaleString()}</div>
                        <div class="product-actions">
                            <div class="quantity-controls">
                                <button class="quantity-btn minus" data-id="${product.id}" aria-label="Decrease quantity">-</button>
                                <span class="quantity" data-id="${product.id}">1</span>
                                <button class="quantity-btn plus" data-id="${product.id}" aria-label="Increase quantity">+</button>
                            </div>
                            <div class="action-buttons">
                                <button class="add-to-cart" data-id="${product.id}" aria-label="Add to cart">Add to Cart</button>
                                <button class="wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}" data-id="${product.id}" aria-label="Add to wishlist">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')
            : `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                  <i class="fas fa-search" style="font-size: 3rem; color: var(--secondary); margin-bottom: 1rem;"></i>
                  <h3 style="color: var(--primary); margin-bottom: 0.5rem;">No products found</h3>
                  <p style="color: var(--text);">We couldn't find any products matching "${query}"</p>
                  <p style="color: var(--text); font-size: 0.9rem; margin-top: 1rem;">Try searching for: roses, tulips, wedding, birthday, or seasonal flowers</p>
               </div>`;
        
        // Highlight search terms in results
        if (query !== '') {
            document.querySelectorAll('.product-name').forEach(name => {
                const text = name.textContent;
                const regex = new RegExp(`(${query})`, 'gi');
                name.innerHTML = text.replace(regex, '<mark>$1</mark>');
            });
        }
    }, 300);
}