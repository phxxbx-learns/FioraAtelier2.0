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
    
    if (isset($input['product_id'])) {
        $product_id = $input['product_id'];
        
        $query = "SELECT i.current_stock, i.min_stock_level, i.max_stock_level 
                  FROM inventory i 
                  WHERE i.product_id = :product_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':product_id', $product_id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $stock_data = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'stock_quantity' => (int)$stock_data['current_stock'],
                'min_stock_level' => (int)$stock_data['min_stock_level'],
                'max_stock_level' => (int)$stock_data['max_stock_level']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Product not found in inventory'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Product ID is required'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Only POST requests are allowed'
    ]);
}
?>