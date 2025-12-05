/**
 * Checkout UI Management
 * Handles checkout process with real stock updates
 */

/**
 * Initialize checkout functionality
 */
function initCheckout() {
    setupRealTimeValidation();
}

/**
 * Setup real-time form validation
 */
function setupRealTimeValidation() {
    const formInputs = checkoutForm.querySelectorAll('input, select');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

/**
 * Populate order summary in checkout
 */
function populateOrderSummary() {
    const orderSummary = document.getElementById('checkout-order-summary');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (!orderSummary || !checkoutTotal) {
        console.error('Order summary elements not found!');
        return;
    }
    
    const items = shoppingCart.getItems();
    orderSummary.innerHTML = items.map(item => `
        <div class="order-item">
            <span>${item.product.name} (${item.quantity})</span>
            <span>₱${(item.product.price * item.quantity).toLocaleString()}</span>
        </div>
    `).join('');
    
    checkoutTotal.textContent = `₱${shoppingCart.total.toLocaleString()}`;
}

/**
 * Handle checkout form submission
 */
async function handleCheckoutSubmit(e) {
    e.preventDefault();
    console.log('Checkout form submitted');
    
    if (!validateForm()) {
        showToast('Please fix the errors in the form', 'error');
        return;
    }
    
    submitOrderBtn.disabled = true;
    const originalText = submitOrderBtn.innerHTML;
    submitOrderBtn.innerHTML = '<div class="loading-spinner"></div> Processing Order...';
    
    try {
        // Process the order with stock updates
        await processOrderWithStockUpdate();
    } catch (error) {
        console.error('Checkout error:', error);
        showToast('Error processing your order. Please try again.', 'error');
        submitOrderBtn.disabled = false;
        submitOrderBtn.innerHTML = originalText;
    }
}

/**
 * Process order and update stock
 */
async function processOrderWithStockUpdate() {
    const items = shoppingCart.getItems();
    
    try {
        // Update stock for all items
        for (const item of items) {
            const result = await updateStock(item.product.id, item.quantity, 'out');
            if (!result.success) {
                throw new Error(`Failed to update stock for ${item.product.name}`);
            }
            console.log(`Stock updated for ${item.product.name}: ${result.previous_stock} -> ${result.new_stock}`);
        }
        
        // Complete the order
        completeOrder();
        
    } catch (error) {
        throw error;
    }
}

/**
 * Update stock for a single product
 */
async function updateStock(productId, quantity, type) {
    try {
        const response = await fetch('./php/api/update-stock.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: quantity,
                type: type
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error updating stock:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Complete the order after successful stock update
 */
function completeOrder() {
    const formData = new FormData(checkoutForm);
    
    const orderData = {
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        shipping: {
            address: formData.get('address'),
            city: formData.get('city'),
            zip: formData.get('zip'),
            country: formData.get('country')
        },
        items: shoppingCart.getItems(),
        total: shoppingCart.total,
        orderDate: new Date().toISOString()
    };
    
    console.log('Order completed successfully:', orderData);
    
    // Add to order history
    if (typeof orderHistory !== 'undefined') {
        orderHistory.addOrder(shoppingCart, shoppingCart.total);
    }
    
    // Show success message
    showToast(`✅ Order placed successfully! Total: ₱${shoppingCart.total.toLocaleString()}`);
    
    // Clear cart and reset
    shoppingCart.clear();
    saveCartToStorage();
    resetCheckoutForm();
    toggleCheckoutModal();
    updateCartUI();
    
    // Refresh product displays to show updated stock
    setTimeout(() => {
        if (typeof renderAllProducts === 'function') {
            renderAllProducts();
        }
    }, 1000);
    
    submitOrderBtn.disabled = false;
    submitOrderBtn.innerHTML = 'Place Order';
}

/**
 * Reset checkout form
 */
function resetCheckoutForm() {
    if (checkoutForm) {
        checkoutForm.reset();
    }
    
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });
}

/**
 * Proceed to checkout
 */
function proceedToCheckout() {
    console.log('Proceed to checkout clicked');
    
    if (shoppingCart.size === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    // Populate order summary
    populateOrderSummary();
    
    // Close cart modal and open checkout modal
    toggleCart();
    setTimeout(() => {
        toggleCheckoutModal();
    }, 300);
}