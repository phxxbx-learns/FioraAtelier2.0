/**
 * Order History Class (Array Implementation)
 * Manages order storage and retrieval
 */
class OrderHistory {
    constructor() {
        this.orders = []; // Array to store orders
    }

    /**
     * Add order to history with timestamp
     */
    addOrder(cart, total, date = new Date()) {
        this.orders.push({
            items: cart.getItems().map(item => ({
                product: item.product,
                quantity: item.quantity
            })),
            total: total,
            date: date
        });
    }

    /**
     * Get all orders
     */
    getOrders() {
        return this.orders;
    }
}