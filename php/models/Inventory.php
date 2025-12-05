<?php
class Inventory {
    private $conn;
    private $table_name = "inventory_transactions";

    public $id;
    public $product_id;
    public $transaction_type;
    public $quantity_change;
    public $previous_stock;
    public $new_stock;
    public $reference_id;
    public $notes;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Record inventory transaction
    public function createTransaction() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET product_id=:product_id, transaction_type=:transaction_type,
                      quantity_change=:quantity_change, previous_stock=:previous_stock,
                      new_stock=:new_stock, reference_id=:reference_id, notes=:notes";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":product_id", $this->product_id);
        $stmt->bindParam(":transaction_type", $this->transaction_type);
        $stmt->bindParam(":quantity_change", $this->quantity_change);
        $stmt->bindParam(":previous_stock", $this->previous_stock);
        $stmt->bindParam(":new_stock", $this->new_stock);
        $stmt->bindParam(":reference_id", $this->reference_id);
        $stmt->bindParam(":notes", $this->notes);
        
        return $stmt->execute();
    }

    // Get inventory history for a product
    public function getProductHistory($product_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE product_id = ? 
                  ORDER BY created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $product_id);
        $stmt->execute();
        
        return $stmt;
    }
}
?>