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
    if (isset($_POST['add_supplier'])) {
        $name = $_POST['name'];
        $contact_person = $_POST['contact_person'];
        $email = $_POST['email'];
        $phone = $_POST['phone'];
        $address = $_POST['address'];
        
        $query = "INSERT INTO suppliers (name, contact_person, email, phone, address) 
                  VALUES (:name, :contact_person, :email, :phone, :address)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':contact_person', $contact_person);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':address', $address);
        
        if ($stmt->execute()) {
            $success = "Supplier added successfully!";
        } else {
            $error = "Failed to add supplier!";
        }
    }
}

// Get all suppliers
$query = "SELECT * FROM suppliers ORDER BY name";
$stmt = $db->prepare($query);
$stmt->execute();
$suppliers = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Suppliers - Fiora Atelier Inventory</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <?php include 'header.php'; ?>
    
    <div class="container">
        <div class="page-header">
            <h1>Suppliers</h1>
            <p>Manage your suppliers and vendor information</p>
        </div>
        
        <?php if (isset($success)): ?>
            <div class="alert alert-success"><?php echo $success; ?></div>
        <?php endif; ?>
        
        <?php if (isset($error)): ?>
            <div class="alert alert-error"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <div class="content-row">
            <!-- Add Supplier Form -->
            <div class="content-card">
                <div class="card-header">
                    <h3>Add New Supplier</h3>
                </div>
                <div class="card-body">
                    <form method="POST" action="">
                        <div class="form-group">
                            <label for="name">Supplier Name</label>
                            <input type="text" name="name" id="name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="contact_person">Contact Person</label>
                            <input type="text" name="contact_person" id="contact_person" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" name="email" id="email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="phone">Phone</label>
                            <input type="text" name="phone" id="phone" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="address">Address</label>
                            <textarea name="address" id="address" rows="3" required></textarea>
                        </div>
                        
                        <button type="submit" name="add_supplier" class="btn-primary">Add Supplier</button>
                    </form>
                </div>
            </div>
            
            <!-- Suppliers List -->
            <div class="content-card">
                <div class="card-header">
                    <h3>All Suppliers</h3>
                </div>
                <div class="card-body">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Contact Person</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($suppliers as $supplier): ?>
                                <tr>
                                    <td>
                                        <strong><?php echo htmlspecialchars($supplier['name']); ?></strong>
                                        <br><small><?php echo substr($supplier['address'], 0, 50) . '...'; ?></small>
                                    </td>
                                    <td><?php echo htmlspecialchars($supplier['contact_person']); ?></td>
                                    <td><?php echo htmlspecialchars($supplier['email']); ?></td>
                                    <td><?php echo htmlspecialchars($supplier['phone']); ?></td>
                                    <td>
                                        <span class="status-badge <?php echo $supplier['status']; ?>">
                                            <?php echo ucfirst($supplier['status']); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <button class="btn-primary btn-sm">Edit</button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</body>
</html>