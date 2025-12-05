<?php
session_start();
include_once '../config/database.php';
include_once '../models/PurchaseOrder.php';
include_once '../models/Product.php';
include_once '../models/PurchaseOrderItem.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$database = new Database();
$db = $database->getConnection();

$purchaseOrder = new PurchaseOrder($db);
$product = new Product($db);
$orderItem = new PurchaseOrderItem($db);

$order_id = $_GET['order_id'] ?? 0;

// Handle adding items to order
if($_POST && isset($_POST['add_item'])){
    $orderItem->purchase_order_id = $order_id;
    $orderItem->product_id = $_POST['product_id'];
    $orderItem->quantity = $_POST['quantity'];
    $orderItem->unit_price = $_POST['unit_price'];
    
    if($orderItem->create()){
        echo "<div class='alert alert-success'>Item added to order!</div>";
    } else {
        echo "<div class='alert alert-error'>Unable to add item.</div>";
    }
}

// Get order details
$purchaseOrder->id = $order_id;
$order = $purchaseOrder->readOne();

// Get products for dropdown
$products_stmt = $product->read();
$products = $products_stmt->fetchAll(PDO::FETCH_ASSOC);

// Get order items
$items_stmt = $orderItem->readByOrder($order_id);
$items = $items_stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Items - Fiora Atelier Inventory</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <?php include 'header.php'; ?>
    
    <div class="container">
        <div class="page-header">
            <h1>Manage Order Items</h1>
            <p>PO-<?php echo str_pad($order_id, 4, '0', STR_PAD_LEFT); ?></p>
        </div>

        <div class="content-row">
            <div class="content-card">
                <div class="card-header">
                    <h3>Add Item to Order</h3>
                </div>
                <div class="card-body">
                    <form method="POST">
                        <div class="form-group">
                            <label>Product</label>
                            <select name="product_id" class="form-control" required>
                                <option value="">Select Product</option>
                                <?php foreach($products as $product_item): ?>
                                <option value="<?php echo $product_item['id']; ?>">
                                    <?php echo $product_item['name']; ?> (₱<?php echo number_format($product_item['price'], 2); ?>)
                                </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Quantity</label>
                            <input type="number" name="quantity" class="form-control" min="1" required>
                        </div>
                        <div class="form-group">
                            <label>Unit Price</label>
                            <input type="number" name="unit_price" class="form-control" step="0.01" min="0" required>
                        </div>
                        <button type="submit" name="add_item" class="btn-primary">Add Item</button>
                    </form>
                </div>
            </div>
            
            <div class="content-card">
                <div class="card-header">
                    <h3>Order Items</h3>
                </div>
                <div class="card-body">
                    <?php if(empty($items)): ?>
                        <p>No items added to this order yet.</p>
                    <?php else: ?>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php 
                            $grand_total = 0;
                            foreach($items as $item): 
                                $item_total = $item['quantity'] * $item['unit_price'];
                                $grand_total += $item_total;
                            ?>
                            <tr>
                                <td><?php echo $item['product_name']; ?></td>
                                <td><?php echo $item['quantity']; ?></td>
                                <td>₱<?php echo number_format($item['unit_price'], 2); ?></td>
                                <td>₱<?php echo number_format($item_total, 2); ?></td>
                            </tr>
                            <?php endforeach; ?>
                            <tr style="background: var(--light);">
                                <td colspan="3" style="text-align: right; font-weight: bold;">Grand Total:</td>
                                <td style="font-weight: bold;">₱<?php echo number_format($grand_total, 2); ?></td>
                            </tr>
                        </tbody>
                    </table>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</body>
</html>