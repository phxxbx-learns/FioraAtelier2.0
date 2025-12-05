<?php
session_start();
require_once '../config/database.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$database = new Database();
$db = $database->getConnection();

// Get dashboard statistics
$stats = [];

// Total Products
$query = "SELECT COUNT(*) as total FROM products";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['total_products'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Low Stock Items
$query = "SELECT COUNT(*) as total FROM inventory WHERE current_stock <= min_stock_level";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['low_stock'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Out of Stock Items
$query = "SELECT COUNT(*) as total FROM inventory WHERE current_stock = 0";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['out_of_stock'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Pending Purchase Orders
$query = "SELECT COUNT(*) as total FROM purchase_orders WHERE status = 'pending'";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['pending_orders'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Recent Transactions
$query = "SELECT it.*, p.name as product_name 
          FROM inventory_transactions it 
          JOIN products p ON it.product_id = p.id 
          ORDER BY it.created_at DESC 
          LIMIT 10";
$stmt = $db->prepare($query);
$stmt->execute();
$recent_transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Low Stock Products
$query = "SELECT i.*, p.name, p.category 
          FROM inventory i 
          JOIN products p ON i.product_id = p.id 
          WHERE i.current_stock <= i.min_stock_level 
          ORDER BY i.current_stock ASC 
          LIMIT 10";
$stmt = $db->prepare($query);
$stmt->execute();
$low_stock_products = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Fiora Atelier Inventory</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <?php include 'header.php'; ?>
    
    <div class="container">
        <div class="dashboard-header">
            <h1>Dashboard</h1>
            <p>Welcome back, <?php echo $_SESSION['full_name']; ?>!</p>
        </div>
        
        <!-- Statistics Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-boxes"></i></div>
                <div class="stat-info">
                    <h3><?php echo $stats['total_products']; ?></h3>
                    <p>Total Products</p>
                </div>
            </div>
            
            <div class="stat-card warning">
                <div class="stat-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="stat-info">
                    <h3><?php echo $stats['low_stock']; ?></h3>
                    <p>Low Stock Items</p>
                </div>
            </div>
            
            <div class="stat-card danger">
                <div class="stat-icon"><i class="fas fa-times-circle"></i></div>
                <div class="stat-info">
                    <h3><?php echo $stats['out_of_stock']; ?></h3>
                    <p>Out of Stock</p>
                </div>
            </div>
            
            <div class="stat-card info">
                <div class="stat-icon"><i class="fas fa-clipboard-list"></i></div>
                <div class="stat-info">
                    <h3><?php echo $stats['pending_orders']; ?></h3>
                    <p>Pending Orders</p>
                </div>
            </div>
        </div>
        
        <div class="dashboard-content">
            <div class="content-row">
                <!-- Low Stock Products -->
                <div class="content-card">
                    <div class="card-header">
                        <h3>Low Stock Alert</h3>
                        <a href="products.php" class="view-all">View All</a>
                    </div>
                    <div class="card-body">
                        <?php if (count($low_stock_products) > 0): ?>
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Current Stock</th>
                                        <th>Min Level</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($low_stock_products as $product): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($product['name']); ?></td>
                                            <td><?php echo htmlspecialchars($product['category']); ?></td>
                                            <td><?php echo $product['current_stock']; ?></td>
                                            <td><?php echo $product['min_stock_level']; ?></td>
                                            <td>
                                                <span class="status-badge <?php echo $product['current_stock'] == 0 ? 'out-of-stock' : 'low-stock'; ?>">
                                                    <?php echo $product['current_stock'] == 0 ? 'Out of Stock' : 'Low Stock'; ?>
                                                </span>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        <?php else: ?>
                            <p class="no-data">No low stock items</p>
                        <?php endif; ?>
                    </div>
                </div>
                
                <!-- Recent Transactions -->
                <div class="content-card">
                    <div class="card-header">
                        <h3>Recent Transactions</h3>
                        <a href="#" class="view-all">View All</a>
                    </div>
                    <div class="card-body">
                        <?php if (count($recent_transactions) > 0): ?>
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Type</th>
                                        <th>Qty</th>
                                        <th>Stock</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($recent_transactions as $transaction): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($transaction['product_name']); ?></td>
                                            <td>
                                                <span class="transaction-type <?php echo $transaction['transaction_type']; ?>">
                                                    <?php echo ucfirst($transaction['transaction_type']); ?>
                                                </span>
                                            </td>
                                            <td><?php echo $transaction['quantity']; ?></td>
                                            <td><?php echo $transaction['new_stock']; ?></td>
                                            <td><?php echo date('M j, H:i', strtotime($transaction['created_at'])); ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        <?php else: ?>
                            <p class="no-data">No recent transactions</p>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>