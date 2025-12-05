<?php
session_start();
require_once '../config/database.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$database = new Database();
$db = $database->getConnection();

// Handle form actions
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['update_stock'])) {
        $product_id = $_POST['product_id'];
        $new_stock = $_POST['current_stock'];
        
        // Get current stock for transaction record
        $query = "SELECT current_stock FROM inventory WHERE product_id = :product_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':product_id', $product_id);
        $stmt->execute();
        $current = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $previous_stock = $current['current_stock'];
        $quantity_change = $new_stock - $previous_stock;
        
        // Update inventory
        $query = "UPDATE inventory SET current_stock = :stock WHERE product_id = :product_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':stock', $new_stock);
        $stmt->bindParam(':product_id', $product_id);
        
        if ($stmt->execute()) {
            // Record transaction
            $transaction_type = $quantity_change > 0 ? 'in' : ($quantity_change < 0 ? 'out' : 'adjustment');
            $query = "INSERT INTO inventory_transactions (product_id, transaction_type, quantity, previous_stock, new_stock, reference_type, notes) 
                      VALUES (:product_id, :type, :quantity, :prev_stock, :new_stock, 'adjustment', 'Manual stock adjustment')";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':product_id', $product_id);
            $stmt->bindParam(':type', $transaction_type);
            $stmt->bindParam(':quantity', $quantity_change);
            $stmt->bindParam(':prev_stock', $previous_stock);
            $stmt->bindParam(':new_stock', $new_stock);
            $stmt->execute();
            
            $success = "Stock updated successfully!";
        } else {
            $error = "Failed to update stock!";
        }
    }
}

// Get all products with inventory data
$query = "SELECT p.*, i.current_stock, i.min_stock_level, i.max_stock_level, i.last_updated 
          FROM products p 
          LEFT JOIN inventory i ON p.id = i.product_id 
          ORDER BY p.name";
$stmt = $db->prepare($query);
$stmt->execute();
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products - Fiora Atelier Inventory</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <?php include 'header.php'; ?>
    
    <div class="container">
        <div class="page-header">
            <h1>Product Inventory</h1>
            <p>Manage product stock levels and settings</p>
        </div>
        
        <?php if (isset($success)): ?>
            <div class="alert alert-success"><?php echo $success; ?></div>
        <?php endif; ?>
        
        <?php if (isset($error)): ?>
            <div class="alert alert-error"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <div class="content-card">
            <div class="card-header">
                <h3>All Products</h3>
                <div class="header-actions">
                    <input type="text" id="searchProducts" placeholder="Search products..." class="search-input">
                </div>
            </div>
            
            <div class="card-body">
                <table class="data-table" id="productsTable">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Current Stock</th>
                            <th>Min Level</th>
                            <th>Max Level</th>
                            <th>Status</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($products as $product): ?>
                            <?php
                            $stock_status = '';
                            if ($product['current_stock'] == 0) {
                                $stock_status = 'out-of-stock';
                            } elseif ($product['current_stock'] <= $product['min_stock_level']) {
                                $stock_status = 'low-stock';
                            } else {
                                $stock_status = 'in-stock';
                            }
                            ?>
                            <tr>
                                <td>
                                    <div class="product-info">
                                        <img src="../../<?php echo $product['image_url']; ?>" alt="<?php echo htmlspecialchars($product['name']); ?>" class="product-thumb">
                                        <div>
                                            <strong><?php echo htmlspecialchars($product['name']); ?></strong>
                                            <small><?php echo substr($product['description'], 0, 50) . '...'; ?></small>
                                        </div>
                                    </div>
                                </td>
                                <td><?php echo htmlspecialchars($product['category']); ?></td>
                                <td>₱<?php echo number_format($product['price'], 2); ?></td>
                                <td>
                                    <span class="stock-number <?php echo $stock_status; ?>">
                                        <?php echo $product['current_stock']; ?>
                                    </span>
                                </td>
                                <td><?php echo $product['min_stock_level']; ?></td>
                                <td><?php echo $product['max_stock_level']; ?></td>
                                <td>
                                    <span class="status-badge <?php echo $stock_status; ?>">
                                        <?php 
                                        switch($stock_status) {
                                            case 'out-of-stock': echo 'Out of Stock'; break;
                                            case 'low-stock': echo 'Low Stock'; break;
                                            default: echo 'In Stock';
                                        }
                                        ?>
                                    </span>
                                </td>
                                <td><?php echo date('M j, Y', strtotime($product['last_updated'])); ?></td>
                                <td>
                                    <form method="POST" class="inline-form">
                                        <input type="hidden" name="product_id" value="<?php echo $product['id']; ?>">
                                        <input type="number" name="current_stock" value="<?php echo $product['current_stock']; ?>" class="small-input" min="0" required>
                                        <button type="submit" name="update_stock" class="btn-primary btn-sm">Update</button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('searchProducts').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#productsTable tbody tr');
            
            rows.forEach(row => {
                const productName = row.querySelector('.product-info strong').textContent.toLowerCase();
                if (productName.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    </script>
</body>
</html>