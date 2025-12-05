/**
 * DOM Elements Reference
 * Centralized location for all DOM element references
 */

// Global Variables
let shoppingCart;
let actionHistory;
let orderHistory;
let wishlist = [];
let currentCategory = 'all';
let currentProductModal = null;

// DOM Elements
const cartIcon = document.getElementById('cart-icon');
const closeCart = document.getElementById('close-cart');
const cartModal = document.getElementById('cart-modal');
const wishlistIcon = document.getElementById('wishlist-icon');
const closeWishlist = document.getElementById('close-wishlist');
const wishlistModal = document.getElementById('wishlist-modal');
const productModal = document.getElementById('product-modal');
const closeProductModal = document.getElementById('close-product-modal');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const wishlistCount = document.getElementById('wishlist-count');
const wishlistItems = document.getElementById('wishlist-items');
const checkoutBtn = document.getElementById('checkout-btn');
const undoBtn = document.getElementById('undo-btn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const productContainer = document.getElementById('product-container');
const freshContainer = document.getElementById('fresh-products');
const syntheticContainer = document.getElementById('synthetic-products');
const navLinks = document.querySelectorAll('.nav-menu li a');
const sortSelect = document.getElementById('sort-select');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavClose = document.getElementById('mobile-nav-close');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu li a');

// Product Modal Elements
const productMainImage = document.getElementById('product-main-image');
const productThumbnails = document.getElementById('product-thumbnails');
const productModalName = document.getElementById('product-modal-name');
const productModalCategory = document.getElementById('product-modal-category');
const productModalPrice = document.getElementById('product-modal-price');
const productModalDescription = document.getElementById('product-modal-description');
const modalMinus = document.getElementById('modal-minus');
const modalPlus = document.getElementById('modal-plus');
const modalQuantity = document.getElementById('modal-quantity');
const modalAddToCart = document.getElementById('modal-add-to-cart');
const modalWishlistBtn = document.getElementById('modal-wishlist-btn');

// Checkout Modal Elements
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.getElementById('close-checkout');
const cancelCheckout = document.getElementById('cancel-checkout');
const checkoutForm = document.getElementById('checkout-form');
const submitOrderBtn = document.getElementById('submit-order');

// Initialize global instances
function initializeGlobalInstances() {
    shoppingCart = new ShoppingCart();
    actionHistory = new ActionHistory();
    orderHistory = new OrderHistory();
}