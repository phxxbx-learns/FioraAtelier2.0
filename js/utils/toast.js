/**
 * Toast Notification System
 * Displays temporary messages to users
 */

/**
 * Show toast notification
 * @param {string} message - Message to display
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (!toastMessage || !toast) return;
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}