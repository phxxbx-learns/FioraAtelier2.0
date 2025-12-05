/**
 * Cart Item Class (Linked List Node)
 * Represents an item in the shopping cart with product and quantity
 * Uses linked list structure for efficient cart operations
 */
class CartItem {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
        this.next = null; // Pointer to next item in linked list
    }
}