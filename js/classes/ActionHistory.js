/**
 * Action History Class (Stack Implementation)
 * Manages undo functionality using LIFO (Last In First Out) principle
 */
class ActionHistory {
    constructor() {
        this.items = []; // Stack storage
    }

    /**
     * Push action to stack
     * Time Complexity: O(1)
     */
    push(action) {
        this.items.push(action);
    }

    /**
     * Pop action from stack (LIFO)
     * Time Complexity: O(1)
     */
    pop() {
        if (this.items.length === 0) return null;
        return this.items.pop();
    }

    /**
     * Check if stack is empty
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Get stack size
     */
    size() {
        return this.items.length;
    }
}