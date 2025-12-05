<?php
// Logout functionality
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: login.php");
    exit();
}
?>
<header class="inventory-header">
    <div class="header-container">
        <div class="logo">
            <h1>Fiora Atelier</h1>
            <span>Inventory Management</span>
        </div>
        
        <nav class="main-nav">
            <a href="dashboard.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'dashboard.php' ? 'active' : ''; ?>">
                <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
            <a href="products.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'products.php' ? 'active' : ''; ?>">
                <i class="fas fa-boxes"></i> Products
            </a>
            <a href="purchase_orders.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'purchase_orders.php' ? 'active' : ''; ?>">
                <i class="fas fa-clipboard-list"></i> Purchase Orders
            </a>
            <a href="suppliers.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'suppliers.php' ? 'active' : ''; ?>">
                <i class="fas fa-truck"></i> Suppliers
            </a>
        </nav>
        
        <div class="user-menu">
            <span>Welcome, <?php echo $_SESSION['full_name']; ?></span>
            <a href="?logout" class="logout-btn">
                <i class="fas fa-sign-out-alt"></i> Logout
            </a>
        </div>
    </div>
</header>