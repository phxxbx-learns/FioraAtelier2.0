<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['product_id']) && isset($input['quantity']) && isset($input['type'])) {
        $product_id = $input['product_id'];
        $quantity = $input['quantity'];
        $type = $input['type'];
        
        try {
            $db->beginTransaction();
            
            // Get current stock
            $query = "SELECT current_stock FROM inventory WHERE product_id = :product_id FOR UPDATE";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':product_id', $product_id);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $current_data = $stmt->fetch(PDO::FETCH_ASSOC);
                $previous_stock = $current_data['current_stock'];
                
                // Calculate new stock
                if ($type === 'out') {
                    $new_stock = $previous_stock - $quantity;
                } elseif ($type === 'in') {
                    $new_stock = $previous_stock + $quantity;
                } else {
                    $new_stock = $quantity;
                }
                
                // Ensure stock doesn't go negative
                if ($new_stock < 0) {
                    throw new Exception('Insufficient stock');
                }
                
                // Update inventory
                $query = "UPDATE inventory SET current_stock = :new_stock, last_updated = NOW() 
                          WHERE product_id = :product_id";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':new_stock', $new_stock);
                $stmt->bindParam(':product_id', $product_id);
                $stmt->execute();
                
                // Record transaction
                $query = "INSERT INTO inventory_transactions 
                         (product_id, transaction_type, quantity, previous_stock, new_stock, reference_type, notes) 
                         VALUES (:product_id, :type, :quantity, :prev_stock, :new_stock, 'sale', 'Online order')";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':product_id', $product_id);
                $stmt->bindParam(':type', $type);
                $stmt->bindParam(':quantity', $quantity);
                $stmt->bindParam(':prev_stock', $previous_stock);
                $stmt->bindParam(':new_stock', $new_stock);
                $stmt->execute();
                
                $db->commit();
                
                echo json_encode([
                    'success' => true,
                    'previous_stock' => $previous_stock,
                    'new_stock' => $new_stock,
                    'message' => 'Stock updated successfully'
                ]);
                
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Product not found in inventory'
                ]);
            }
            
        } catch (Exception $e) {
            $db->rollBack();
            echo json_encode([
                'success' => false,
                'message' => 'Error updating stock: ' . $e->getMessage()
            ]);
        }
        
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Missing required parameters'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Only POST requests are allowed'
    ]);
}
?>