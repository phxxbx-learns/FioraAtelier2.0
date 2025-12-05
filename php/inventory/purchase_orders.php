<?php
session_start();
include_once '../config/database.php';
include_once '../models/PurchaseOrder.php';
include_once '../models/Supplier.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$database = new Database();
$db = $database->getConnection();

// Check connection
if(!$db) {
    die("<div class='alert alert-error'>Database connection failed!</div>");
}

$purchaseOrder = new PurchaseOrder($db);
$supplier = new Supplier($db);

// Handle form submissions
if($_POST){
    if(isset($_POST['create_order'])){
        $purchaseOrder->supplier_id = $_POST['supplier_id'];
        $purchaseOrder->order_date = $_POST['order_date'];
        $purchaseOrder->expected_date = $_POST['expected_date'];
        $purchaseOrder->status = 'pending';
        $purchaseOrder->total_amount = 0;
        
        // Date validation
        if($purchaseOrder->expected_date < $purchaseOrder->order_date){
            echo "<div class='alert alert-error'>Expected date cannot be before order date.</div>";
        } elseif(!$purchaseOrder->supplier_id) {
            echo "<div class='alert alert-error'>Please select a valid supplier.</div>";
        } else {
            if($purchaseOrder->create()){
                $order_id = $purchaseOrder->id;
                echo "<div class='alert alert-success'>Purchase order created successfully! 
                      <a href='purchase_order_items.php?order_id=$order_id' style='margin-left: 10px;'>Add Items</a></div>";
            } else {
                echo "<div class='alert alert-error'>Unable to create purchase order. Please check your database.</div>";
            }
        }
    }
    
    if(isset($_POST['update_status'])){
        $purchaseOrder->id = $_POST['order_id'];
        $purchaseOrder->status = $_POST['status'];
        
        if($purchaseOrder->updateStatus()){
            echo "<div class='alert alert-success'>Order status updated successfully!</div>";
        } else {
            echo "<div class='alert alert-error'>Unable to update order status.</div>";
        }
    }
}

// Handle search and filter
$search = $_GET['search'] ?? '';
$status_filter = $_GET['status'] ?? '';

// Read purchase orders with filters
try {
    $stmt = $purchaseOrder->readWithFilters($search, $status_filter);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    echo "<div class='alert alert-error'>Error reading purchase orders: " . $e->getMessage() . "</div>";
    $orders = [];
}

// Read suppliers
try {
    $supplier_stmt = $supplier->read();
    $suppliers = $supplier_stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    echo "<div class='alert alert-error'>Error reading suppliers: " . $e->getMessage() . "</div>";
    $suppliers = [];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purchase Orders - Fiora Atelier Inventory</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <?php include 'header.php'; ?>
    
    <div class="container">
        <div class="page-header">
            <h1>Purchase Orders</h1>
            <p>Manage and track purchase orders from suppliers</p>
        </div>
        
        <!-- Search and Filter Section -->
        <div class="content-card">
            <div class="card-header">
                <h3>Search & Filter Orders</h3>
            </div>
            <div class="card-body">
                <form method="GET" style="display: flex; gap: 15px; align-items: end;">
                    <div class="form-group" style="flex: 1;">
                        <label for="search">Search</label>
                        <input type="text" class="form-control" id="search" name="search" 
                               value="<?php echo htmlspecialchars($search); ?>" 
                               placeholder="Search by order ID or supplier...">
                    </div>
                    <div class="form-group">
                        <label for="status">Status</label>
                        <select class="form-control" id="status" name="status">
                            <option value="">All Statuses</option>
                            <option value="pending" <?php echo $status_filter == 'pending' ? 'selected' : ''; ?>>Pending</option>
                            <option value="ordered" <?php echo $status_filter == 'ordered' ? 'selected' : ''; ?>>Ordered</option>
                            <option value="received" <?php echo $status_filter == 'received' ? 'selected' : ''; ?>>Received</option>
                            <option value="cancelled" <?php echo $status_filter == 'cancelled' ? 'selected' : ''; ?>>Cancelled</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn-primary">Apply Filters</button>
                        <a href="purchase_orders.php" class="btn-primary" style="background: var(--secondary); text-decoration: none; display: inline-block; padding: 0.8rem 1.5rem; border-radius: var(--radius);">Clear</a>
                    </div>
                </form>
            </div>
        </div>

        <!-- Create Purchase Order Form -->
        <div class="content-card">
            <div class="card-header">
                <h3>Create New Purchase Order</h3>
            </div>
            <div class="card-body">
                <form method="POST">
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                        <div class="form-group">
                            <label for="supplier_id">Supplier</label>
                            <select class="form-control" id="supplier_id" name="supplier_id" required>
                                <option value="">Select a supplier...</option>
                                <?php foreach($suppliers as $supplier_item): ?>
                                <option value="<?php echo $supplier_item['id']; ?>" 
                                    <?php echo isset($_POST['supplier_id']) && $_POST['supplier_id'] == $supplier_item['id'] ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($supplier_item['name']); ?>
                                </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="order_date">Order Date</label>
                            <input type="date" class="form-control" id="order_date" name="order_date" 
                                   value="<?php echo isset($_POST['order_date']) ? $_POST['order_date'] : date('Y-m-d'); ?>" required>
                        </div>
                        <div class="form-group">
                            <label for="expected_date">Expected Delivery Date</label>
                            <input type="date" class="form-control" id="expected_date" name="expected_date" 
                                   value="<?php echo isset($_POST['expected_date']) ? $_POST['expected_date'] : ''; ?>" 
                                   min="<?php echo date('Y-m-d'); ?>" required>
                        </div>
                    </div>
                    <div class="form-group" style="margin-top: 20px;">
                        <button type="submit" name="create_order" class="btn-primary">
                            <i class="fas fa-plus"></i> Create Purchase Order
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Purchase Orders Table -->
        <div class="content-card">
            <div class="card-header">
                <h3>Purchase Orders</h3>
            </div>
            <div class="card-body">
                <?php if(empty($orders)): ?>
                    <div class="alert alert-info">No purchase orders found. <?php echo empty($suppliers) ? 'You need to add suppliers first.' : ''; ?></div>
                <?php else: ?>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Supplier</th>
                            <th>Order Date</th>
                            <th>Expected Date</th>
                            <th>Status</th>
                            <th>Total Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach($orders as $order): ?>
                        <tr>
                            <td><strong>PO-<?php echo str_pad($order['id'], 4, '0', STR_PAD_LEFT); ?></strong></td>
                            <td><?php echo htmlspecialchars($order['supplier_name']); ?></td>
                            <td><?php echo date('M j, Y', strtotime($order['order_date'])); ?></td>
                            <td>
                                <?php 
                                $expected_date = strtotime($order['expected_date']);
                                $today = strtotime(date('Y-m-d'));
                                $class = '';
                                if($order['status'] != 'received' && $order['status'] != 'cancelled') {
                                    if($expected_date < $today) {
                                        $class = 'text-danger';
                                    } elseif($expected_date == $today) {
                                        $class = 'text-warning';
                                    }
                                }
                                ?>
                                <span class="<?php echo $class; ?>" style="font-weight: <?php echo $class ? 'bold' : 'normal'; ?>">
                                    <?php echo date('M j, Y', $expected_date); ?>
                                </span>
                            </td>
                            <td>
                                <span class="status-badge <?php echo $order['status']; ?>">
                                    <?php echo ucfirst($order['status']); ?>
                                </span>
                            </td>
                            <td><strong>₱<?php echo number_format($order['total_amount'] ?? 0, 2); ?></strong></td>
                            <td>
                                <div style="display: flex; gap: 5px; align-items: center;">
                                    <a href="view_order.php?id=<?php echo $order['id']; ?>" class="btn-primary btn-sm" title="View Order" style="text-decoration: none;">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <a href="purchase_order_items.php?order_id=<?php echo $order['id']; ?>" class="btn-primary btn-sm" title="Manage Items" style="text-decoration: none; background: var(--success);">
                                        <i class="fas fa-boxes"></i>
                                    </a>
                                    <form method="POST" style="display: inline;">
                                        <input type="hidden" name="order_id" value="<?php echo $order['id']; ?>">
                                        <select name="status" onchange="this.form.submit()" style="padding: 0.4rem; border-radius: var(--radius); border: 1px solid var(--accent); font-size: 0.9rem;">
                                            <option value="pending" <?php echo $order['status'] == 'pending' ? 'selected' : ''; ?>>Pending</option>
                                            <option value="ordered" <?php echo $order['status'] == 'ordered' ? 'selected' : ''; ?>>Ordered</option>
                                            <option value="received" <?php echo $order['status'] == 'received' ? 'selected' : ''; ?>>Received</option>
                                            <option value="cancelled" <?php echo $order['status'] == 'cancelled' ? 'selected' : ''; ?>>Cancelled</option>
                                        </select>
                                        <input type="hidden" name="update_status" value="1">
                                    </form>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <style>
        .text-danger { color: var(--danger); }
        .text-warning { color: var(--warning); }
        .alert {
            padding: 12px 16px;
            border-radius: var(--radius);
            margin: 15px 0;
            border-left: 4px solid;
        }
        .alert-success {
            background: #d4edda;
            color: #155724;
            border-left-color: var(--success);
        }
        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border-left-color: var(--danger);
        }
        .alert-info {
            background: #d1ecf1;
            color: #0c5460;
            border-left-color: var(--info);
        }
        .page-header {
            margin-bottom: 2rem;
        }
        .page-header h1 {
            color: var(--primary);
            margin-bottom: 0.5rem;
        }
        .page-header p {
            color: var(--text);
            opacity: 0.8;
        }
    </style>
</body>
</html>