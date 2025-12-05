<?php
class PurchaseOrder {
    private $conn;
    private $table_name = "purchase_orders";

    public $id;
    public $supplier_id;
    public $order_date;
    public $expected_date;
    public $status;
    public $total_amount;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create purchase order
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET supplier_id=:supplier_id, order_date=:order_date, 
                      expected_date=:expected_date, status=:status, total_amount=:total_amount";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":supplier_id", $this->supplier_id);
        $stmt->bindParam(":order_date", $this->order_date);
        $stmt->bindParam(":expected_date", $this->expected_date);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":total_amount", $this->total_amount);
        
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // Read all purchase orders - FIXED: removed expected_delivery reference
    public function read() {
        $query = "SELECT po.*, s.name as supplier_name 
                  FROM " . $this->table_name . " po
                  LEFT JOIN suppliers s ON po.supplier_id = s.id
                  ORDER BY po.order_date DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    // Update purchase order status
    public function updateStatus() {
        $query = "UPDATE " . $this->table_name . " 
                  SET status = :status 
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':id', $this->id);
        
        return $stmt->execute();
    }

    // Read with filters - FIXED: removed expected_delivery reference
    public function readWithFilters($search = '', $status = '') {
        $query = "SELECT po.*, s.name as supplier_name 
                  FROM " . $this->table_name . " po 
                  LEFT JOIN suppliers s ON po.supplier_id = s.id 
                  WHERE 1=1";
        
        $params = [];
        
        if (!empty($search)) {
            $query .= " AND (po.id LIKE :search OR s.name LIKE :search)";
            $params[':search'] = '%' . $search . '%';
        }
        
        if (!empty($status)) {
            $query .= " AND po.status = :status";
            $params[':status'] = $status;
        }
        
        $query .= " ORDER BY po.order_date DESC";
        
        $stmt = $this->conn->prepare($query);
        
        foreach ($params as $param => $value) {
            $stmt->bindValue($param, $value);
        }
        
        $stmt->execute();
        return $stmt;
    }

    // Read single purchase order - FIXED: removed expected_delivery reference
    public function readOne() {
        $query = "SELECT po.*, s.name as supplier_name 
                  FROM " . $this->table_name . " po
                  LEFT JOIN suppliers s ON po.supplier_id = s.id
                  WHERE po.id = ?
                  LIMIT 0,1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $this->supplier_id = $row['supplier_id'];
            $this->order_date = $row['order_date'];
            $this->expected_date = $row['expected_date'];
            $this->status = $row['status'];
            $this->total_amount = $row['total_amount'];
            $this->supplier_name = $row['supplier_name'];
            return $row;
        }
        
        return false;
    }
}
?>