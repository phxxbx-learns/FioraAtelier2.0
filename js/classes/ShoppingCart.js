/**
 * Shopping Cart Class (Linked List Implementation)
 * Manages cart operations using linked list for efficient add/remove operations
 * O(1) for add, O(n) for remove/update operations
 */
class ShoppingCart {
    constructor() {
        this.head = null; // First item in cart
        this.tail = null; // Last item in cart
        this.size = 0;    // Number of items in cart
        this.total = 0;   // Total price of all items
    }

    /**
     * Add item to cart (insert at end of linked list)
     * Time Complexity: O(1)
     */
    addItem(product, quantity) {
        const MAX_ITEMS = 99;
        
        // Check if adding would exceed limit
        const currentItem = this.getItems().find(item => item.product.id === product.id);
        const currentQty = currentItem ? currentItem.quantity : 0;
        const newQty = currentQty + quantity;
        
        if (newQty > MAX_ITEMS) {
            throw new Error(`Maximum ${MAX_ITEMS} items allowed per product`);
        }
        
        const newItem = new CartItem(product, quantity);
        
        if (this.head === null) {
            // Empty cart - set as both head and tail
            this.head = newItem;
            this.tail = newItem;
        } else {
            // Add to end of linked list
            this.tail.next = newItem;
            this.tail = newItem;
        }
        
        this.size++;
        this.calculateTotal();
        return newItem;
    }

    /**
     * Remove item from cart by product ID
     * Time Complexity: O(n) - linear search through linked list
     */
    removeItem(productId) {
        if (this.head === null) return null;
        
        let removedItem = null;
        
        // If removing the head
        if (this.head.product.id === productId) {
            removedItem = this.head;
            this.head = this.head.next;
            if (this.head === null) this.tail = null; // Cart is now empty
            this.size--;
            this.calculateTotal();
            return removedItem;
        }
        
        // Search for the item to remove (linear traversal)
        let current = this.head;
        while (current.next !== null) {
            if (current.next.product.id === productId) {
                removedItem = current.next;
                current.next = current.next.next;
                
                // If we removed the tail, update tail
                if (current.next === null) {
                    this.tail = current;
                }
                
                this.size--;
                this.calculateTotal();
                return removedItem;
            }
            current = current.next;
        }
        
        return null; // Item not found
    }

    /**
     * Update item quantity with validation
     * Time Complexity: O(n) - linear search
     */
    updateQuantity(productId, newQuantity) {
        const MAX_ITEMS = 99;
        
        if (newQuantity > MAX_ITEMS) {
            throw new Error(`Maximum ${MAX_ITEMS} items allowed per product`);
        }
        
        let current = this.head;
        while (current !== null) {
            if (current.product.id === productId) {
                const oldQuantity = current.quantity;
                current.quantity = newQuantity;
                this.calculateTotal();
                return { product: current.product, oldQuantity, newQuantity };
            }
            current = current.next;
        }
        return null;
    }

    /**
     * Calculate total price by traversing linked list
     * Time Complexity: O(n) - must visit every node
     */
    calculateTotal() {
        this.total = 0;
        let current = this.head;
        while (current !== null) {
            this.total += current.product.price * current.quantity;
            current = current.next;
        }
        return this.total;
    }

    /**
     * Get all items as array (for display and processing)
     * Time Complexity: O(n) - converts linked list to array
     */
    getItems() {
        const items = [];
        let current = this.head;
        while (current !== null) {
            items.push(current);
            current = current.next;
        }
        return items;
    }

    /**
     * Clear cart by resetting all properties
     */
    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.total = 0;
    }
}