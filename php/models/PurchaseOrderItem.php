<?php
class PurchaseOrderItem {
    private $conn;
    private $table_name = "purchase_order_items";

    public $id;
    public $purchase_order_id;
    public $product_id;
    public $quantity;
    public $unit_price; // This is the PHP property name

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET purchase_order_id=:purchase_order_id, 
                      product_id=:product_id, 
                      quantity=:quantity, 
                      unit_cost=:unit_price"; // Using unit_cost column

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->purchase_order_id = htmlspecialchars(strip_tags($this->purchase_order_id));
        $this->product_id = htmlspecialchars(strip_tags($this->product_id));
        $this->quantity = htmlspecialchars(strip_tags($this->quantity));
        $this->unit_price = htmlspecialchars(strip_tags($this->unit_price));

        // Bind values
        $stmt->bindParam(":purchase_order_id", $this->purchase_order_id);
        $stmt->bindParam(":product_id", $this->product_id);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":unit_price", $this->unit_price);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function readByOrder($order_id) {
        $query = "SELECT poi.*, p.name as product_name 
                  FROM " . $this->table_name . " poi
                  LEFT JOIN products p ON poi.product_id = p.id
                  WHERE poi.purchase_order_id = ?
                  ORDER BY poi.id ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $order_id);
        $stmt->execute();

        return $stmt;
    }
}
?>